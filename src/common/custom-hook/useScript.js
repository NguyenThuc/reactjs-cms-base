import { useEffect } from 'react'

const useScript = (obj) => {
  useEffect(() => {
    const script = document.createElement('script')

    for (let [key, value] of Object.entries(obj)) {
      script[key] = value
    }

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [obj.src])
}

export default useScript
