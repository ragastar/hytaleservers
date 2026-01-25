import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { randomBytes } from 'crypto';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[а-яё]/g, (char) => {
      const translit: Record<string, string> = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '',
        'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
      };
      return translit[char] || char;
    })
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function generateSecretKey(): string {
  return randomBytes(32).toString('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, ip, port, short_description, full_description, logo_url, banner_url, website_url, discord_url, categories } = body;
 
    if (!name || !ip) {
      return NextResponse.json(
        { error: 'Name and IP are required' },
        { status: 400 }
      );
    }
 
    const supabase = await createClient();
    
    // Проверить авторизацию
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
 
    const slug = generateSlug(name);
    const secretKey = generateSecretKey();
 
    const { data: server, error: serverError } = await supabase
      .from('servers')
      .insert({
        name,
        slug,
        ip,
        port: port || 25565,
        short_description,
        full_description,
        logo_url,
        banner_url,
        website_url,
        discord_url,
        owner_id: user.id,
        secret_key: secretKey,
        status: 'pending',
        current_players: 0,
        max_players: 100,
        total_votes: 0,
        rating: 0,
        uptime_percentage: 0
      })
      .select()
      .single();

    if (serverError) {
      console.error('Server creation error:', serverError);
      return NextResponse.json(
        { error: 'Failed to create server', details: serverError.message },
        { status: 500 }
      );
    }

    if (categories && Array.isArray(categories) && categories.length > 0) {
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .in('slug', categories);

      if (categoryError) {
        console.error('Category fetch error:', categoryError);
      } else if (categoryData) {
        const serverCategories = categoryData.map((cat: any) => ({
          server_id: server.id,
          category_id: cat.id
        }));

        const { error: insertError } = await supabase
          .from('server_categories')
          .insert(serverCategories);

        if (insertError) {
          console.error('Server categories insert error:', insertError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Server submitted successfully. It will be reviewed and approved soon.',
      server: {
        id: server.id,
        name: server.name,
        slug: server.slug,
        status: server.status
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const slug = searchParams.get('slug');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const sort = searchParams.get('sort') || 'rating';
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'approved';

    const supabase = await createClient();

    // If slug is provided, return single server details
    if (slug) {
      const { data: server, error } = await supabase
        .from('servers')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('slug', slug)
        .single();

      if (error || !server) {
        return NextResponse.json(
          { error: 'Server not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ server });
    }

    const offset = (page - 1) * limit;

    let query = supabase
      .from('servers')
      .select(`
        *,
        categories!inner(
          id,
          name,
          slug,
          icon
        )
      `, { count: 'exact' });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (category) {
      query = query.contains('categories', [{ slug: category }]);
    }

    const sortColumn = sort === 'players' ? 'current_players' : 
                       sort === 'new' ? 'created_at' : 
                       sort === 'votes' ? 'total_votes' : 'rating';

    query = query.order(sortColumn, { ascending: sort !== 'rating' && sort !== 'players' })
                 .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Database error', details: error.message },
        { status: 500 }
      );
    }

    const servers = data?.map(server => ({
      id: server.id,
      name: server.name,
      slug: server.slug,
      ip: server.ip,
      port: server.port,
      online_players: server.current_players || 0,
      max_players: server.max_players || 100,
      short_description: server.short_description,
      full_description: server.full_description,
      logo_url: server.logo_url,
      banner_url: server.banner_url,
      website_url: server.website_url,
      discord_url: server.discord_url,
      categories: server.categories?.map((c: any) => ({
        slug: c.slug,
        name: c.name,
        icon: c.icon
      })),
      status: server.status,
      total_votes: server.total_votes,
      rating: server.rating,
      uptime_percentage: server.uptime_percentage,
      created_at: server.created_at
    })) || [];

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json({
      data: servers,
      total: count || 0,
      page,
      limit,
      totalPages
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
