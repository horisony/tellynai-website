import { renderToString } from 'react-dom/server'
import { App } from './App.jsx'

export function render(pathname, language) {
  return renderToString(<App initialPath={pathname} initialLanguage={language} />)
}
