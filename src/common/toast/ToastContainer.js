import { toast } from 'react-toastify'

const defaultConfig = {
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  position: toast.POSITION.TOP_RIGHT,
}
export function toastWarn(message, dynamicConfig) {
  return toast.warn(message, { ...defaultConfig, ...dynamicConfig })
}

export function toastInfo(message, dynamicConfig) {
  return toast.info(message, { ...defaultConfig, ...dynamicConfig })
}

export function toastSuccess(message, dynamicConfig) {
  return toast.success(message, { ...defaultConfig, ...dynamicConfig })
}

export function toastError(message, dynamicConfig) {
  return toast.error(message, { ...defaultConfig, ...dynamicConfig })
}

export function toastPreventDupByActive(callback, message, dynamicConfig, toastId) {
  if (!toast.isActive(toastId.current)) {
    toastId.current = callback(message, dynamicConfig, toast)
  }
}

export function toastRunOnceTime(callback, message, dynamicConfig, toastRef, toastId) {
  if (toastRef.current !== toastId) {
    toastRef.current = callback(message, { ...dynamicConfig, toastId })
  }
}

export function toastPromise(callbackPromise) {
  return toast.promise(callbackPromise, {
    pending: {
      render() {
        return 'Loading data....'
      },
      icon: false,
      ...defaultConfig,
    },
    success: {
      render({ data }) {
        return data ? data : 'Loading data success'
      },
      icon: '✅',
      ...defaultConfig,
    },
    error: {
      render({ data }) {
        return data ? data : 'Loading data failed'
      },
      icon: '⚠️',
      ...defaultConfig,
    },
  })
}
