import type { JSX } from 'solid-js/jsx-runtime'

export const BlackKey = (
  props: JSX.IntrinsicAttributes & JSX.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  return (
    <button
      class='bg-gradient-black rounded-b-[3px] drop-shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] border-[#171A26] border w-16 -mr-8 -ml-8 z-10 h-60 data-[state=active]:bg-gradient-yellow-green'
      {...props}
    />
  )
}
