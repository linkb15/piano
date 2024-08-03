import type { JSX } from 'solid-js/jsx-runtime'
import { cn } from '~/lib/cn'

export const WhiteKey = (
  props: JSX.IntrinsicAttributes & JSX.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  return (
    <button
      class={cn(
        'bg-gradient-white rounded-[0_0_3px_3px] focus:shadow-[0_2px_2px_rgba(0,0,0,0.4)] border w-24 h-96 data-[state=active]:shadow-[0_2px_2px_rgba(0,0,0,0.4)] data-[state=active]:bg-gradient-yellow-green drop-shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)]'
      )}
      {...props}
    />
  )
}
