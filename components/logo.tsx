interface LogoProps {
  size?: number
  className?: string
  title?: string
}

/**
 * Original mark: two drafting brackets around a joint node, read as both
 * `{ }` (JSON) and a survey/blueprint corner marker. Built on a 32x32 grid
 * with a fixed 3-unit stroke so it stays legible from favicon to hero sizes.
 */
export function Logo({ size = 24, className, title }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <path
        d="M12 4.5C9.5 4.5 8.5 5.8 8.5 8V12.2C8.5 13.6 8 14.4 6 15.4V16.6C8 17.6 8.5 18.4 8.5 19.8V24C8.5 26.2 9.5 27.5 12 27.5"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="square"
      />
      <path
        d="M20 4.5C22.5 4.5 23.5 5.8 23.5 8V12.2C23.5 13.6 24 14.4 26 15.4V16.6C24 17.6 23.5 18.4 23.5 19.8V24C23.5 26.2 22.5 27.5 20 27.5"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="square"
      />
      <circle cx="16" cy="16" r="2.25" fill="currentColor" />
    </svg>
  )
}
