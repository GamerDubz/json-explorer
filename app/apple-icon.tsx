import { ImageResponse } from 'next/og'

export const dynamic = 'force-static'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F4F3FC',
        }}
      >
        <svg width="120" height="120" viewBox="0 0 32 32" fill="none">
          <path
            d="M12 5.5C9.9 5.5 9 6.6 9 8.5V12.2C9 13.5 8.5 14.3 6.7 15.2V16.8C8.5 17.7 9 18.5 9 19.8V23.5C9 25.4 9.9 26.5 12 26.5"
            stroke="#4F3FF0"
            strokeWidth="2.8"
            strokeLinecap="square"
          />
          <path
            d="M20 5.5C22.1 5.5 23 6.6 23 8.5V12.2C23 13.5 23.5 14.3 25.3 15.2V16.8C23.5 17.7 23 18.5 23 19.8V23.5C23 25.4 22.1 26.5 20 26.5"
            stroke="#4F3FF0"
            strokeWidth="2.8"
            strokeLinecap="square"
          />
          <circle cx="16" cy="16" r="2.2" fill="#4F3FF0" />
        </svg>
      </div>
    ),
    { ...size }
  )
}
