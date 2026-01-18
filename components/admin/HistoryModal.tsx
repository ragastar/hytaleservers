'use client';

import { useState, useEffect } from 'react';
import { SiteSetting, SettingHistoryItem } from '@/lib/settings';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface HistoryModalProps {
  open: boolean;
  onClose: () => void;
  setting: SiteSetting;
  onRollback: (version: number) => Promise<void>;
}

export function HistoryModal({ open, onClose, setting, onRollback }: HistoryModalProps) {
  const [history, setHistory] = useState<SettingHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [rollingBack, setRollingBack] = useState<null | number>(null);

  useEffect(() => {
    if (open && setting) {
      loadHistory();
    }
  }, [open, setting]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/settings/history/${setting.key}`);
      const data = await response.json();

      if (response.ok) {
        setHistory(data.history || []);
      } else {
        toast.error('Ошибка загрузки истории');
      }
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Ошибка загрузки истории');
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (version: number) => {
    try {
      setRollingBack(version);
      await onRollback(version);
      toast.success(`Успешно откачено на версию ${version}`);
      onClose();
    } catch (error) {
      console.error('Rollback error:', error);
      toast.error('Ошибка отката');
    } finally {
      setRollingBack(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>История изменений: {setting.label}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : history.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            История изменений пуста
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((item, index) => (
              <div
                key={item.version}
                className="flex items-center justify-between p-4 border rounded-lg bg-card"
              >
                <div className="flex-1">
                  <div className="font-medium text-foreground mb-1">
                    Версия {item.version}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>
                      {item.changed_by ? `Изменил: ${item.changed_by}` : 'Система'}
                    </div>
                    <div>
                      {new Date(item.changed_at).toLocaleString('ru-RU', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </div>
                  </div>
                  {item.value && typeof item.value === 'string' && item.value.length < 100 && (
                    <div className="mt-2 p-2 bg-muted rounded text-sm">
                      {item.value}
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => handleRollback(item.version)}
                  variant="outline"
                  size="sm"
                  disabled={rollingBack === item.version}
                  className="ml-4"
                >
                  {rollingBack === item.version ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Откатиться
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
