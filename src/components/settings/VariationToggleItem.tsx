'use client'

import { useTranslations } from 'next-intl'
import { AlertTriangle } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface VariationToggleItemProps {
  checked: boolean
  label: string
  subtitle: string
  additionalCount: number
  hasWarning: boolean
  onToggle: (value: boolean) => void
}

export function VariationToggleItem({
  checked,
  label,
  subtitle,
  additionalCount,
  hasWarning,
  onToggle,
}: VariationToggleItemProps) {
  const t = useTranslations('VariationToggles')
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{label}</span>
          <Badge variant="secondary" className="text-xs">
            +{additionalCount}
          </Badge>
          {hasWarning && checked && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    className="text-amber-500 hover:text-amber-600"
                    aria-label="Warning: disabling will hide registered data"
                  />
                }
              >
                <AlertTriangle className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs text-xs">
                {t('warningTooltip')}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onToggle}
        aria-label={label}
      />
    </div>
  )
}
