import React from 'react'

interface Props {
  href: string
}

const Link: React.FunctionComponent<Props> = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
)

export default Link
