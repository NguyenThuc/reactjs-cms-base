import React, { forwardRef, useEffect, useState } from 'react'
import { CButton, CForm, CFormInput, CImage, CInputGroup } from '@coreui/react'
import './style.css'
import PropTypes from 'prop-types'

export const CMSFileInput = forwardRef((props, ref) => {
  const [previews, setPreviews] = useState()
  const [selectedFile, setSelectedFile] = useState()
  const { allowedFileTypes, allowedFileExtensions, afterSelectFile, afterRemoveFile, ...rest } =
    props

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreviews(undefined)
      return
    }

    const fileUrls = []
    for (const [key, value] of Object.entries(selectedFile)) {
      fileUrls[key] = URL.createObjectURL(value)
    }

    setPreviews(fileUrls)

    if (typeof afterSelectFile === 'function') {
      afterSelectFile()
    }

    // free memory when ever this component is unmounted
    return () => previews && [...previews].map((preview) => URL.revokeObjectURL(preview))
  }, [selectedFile])

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }
    setSelectedFile(e.target.files)
  }

  const onRemoveFile = () => {
    setSelectedFile(undefined)
    console.log('ref', ref)
    // ref.current.value = ''
    setPreviews(undefined)

    if (typeof afterRemoveFile === 'function') {
      afterRemoveFile()
    }
  }

  const acceptFileStr = () =>
    [
      allowedFileTypes?.map((value) => value.concat('/*')).join(','),
      allowedFileExtensions?.map((value) => '.'.concat(value)).join(','),
    ].join(',')

  return (
    <CForm>
      {selectedFile && previews && (
        <div className="clearfix">
          {[...previews].map((preview, key) => (
            <CImage
              align={'start'}
              key={key}
              rounded
              thumbnail
              width={200}
              height={200}
              src={preview}
            />
          ))}
        </div>
      )}
      <CInputGroup className="mb-3">
        <CFormInput
          onChange={onSelectFile}
          type="file"
          ref={ref}
          accept={acceptFileStr()}
          {...rest}
        />
        {selectedFile && (
          <CButton
            onClick={onRemoveFile}
            type="button"
            color="dark"
            variant="outline"
            id="button-addon2"
          >
            Remove
          </CButton>
        )}
      </CInputGroup>
    </CForm>
  )
})

CMSFileInput.propTypes = {
  allowedFileTypes: PropTypes.array.isRequired,
  allowedFileExtensions: PropTypes.array,
  afterSelectFile: PropTypes.func,
  afterRemoveFile: PropTypes.func,
}

CMSFileInput.displayName = 'CMSFileInput'
