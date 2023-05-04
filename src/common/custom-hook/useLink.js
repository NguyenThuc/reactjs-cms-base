import { useEffect } from 'react'

const useLink = (obj) => {
  useEffect(() => {
    const script = document.createElement('link')

    for (let [key, value] of Object.entries(obj)) {
      script[key] = value
    }

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [obj.href])
}

export default useLink
