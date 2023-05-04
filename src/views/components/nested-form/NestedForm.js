import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CInputGroup,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import * as icon from '@coreui/icons'
import DatePicker from 'react-multi-date-picker'
import TimePicker from 'react-multi-date-picker/plugins/analog_time_picker'
import { CMSFieldSet, CMSLegend } from '../../../common/styled-component'
import MoviePopupList from '../movie/PopupList'

const NestedForm = () => {
  const [mdMovieVisible, setMdMovieVisible] = React.useState(false)
  const defaultValues = {
    licenseRangeDate: [new Date().setDate(3), new Date().setDate(10)],
    test: [
      {
        name: 'useFieldArray1',
        nestedArray: [{ field1: 'field1', field2: 'field2' }],
      },
      {
        name: 'useFieldArray2',
        nestedArray: [{ field1: 'field1', field2: 'field2' }],
      },
      {
        name: 'useFieldArray3',
        nestedArray: [{ field1: 'field1', field2: 'field2' }],
      },
    ],
  }
  const { control, register, handleSubmit, getValues, errors, reset, setValue } = useForm({
    defaultValues,
  })

  // setValue('licenseStartDate', new Date())
  const onSubmit = (data) =>
    console.log(
      'startDate',
      new Date(data.licenseRangeDate[0]),
      '\nendDate',
      new Date(data.licenseRangeDate[1]),
    )

  const [vmdId, setVmdId] = React.useState(undefined)
  const [vmName, setVmName] = React.useState(undefined)
  console.log('vmdId', vmdId)
  const onSelectMovie = () => {
    setMdMovieVisible(true)
  }
  return (
    <CContainer>
      <div className="form-control">
        <CForm className="g-3 row needs-validation" onSubmit={handleSubmit(onSubmit)}>
          {/*<FieldArray {...{ control, register, defaultValues, getValues, setValue, errors }} />*/}

          <CCol md={5}>
            <CFormLabel htmlFor="inputRangeDate">License Range Date</CFormLabel>
            <Controller
              control={control}
              name={'licenseRangeDate'}
              render={({ field: { value, name, onChange } }) => (
                <DatePicker
                  name={name}
                  containerStyle={{ display: 'block' }}
                  onChange={(date) => {
                    onChange(date)
                  }}
                  value={value || ''}
                  format="YYYY-MM-DD HH:mm:ss"
                  plugins={[<TimePicker key={1} />]}
                  range={true}
                  render={(valuePre, openCalendar) => {
                    return (
                      <CInputGroup className="mb-3">
                        <CFormInput
                          id="inputRangeDate"
                          aria-describedby="calendar-addon"
                          value={valuePre}
                          readOnly={true}
                        />
                        <CButton
                          onClick={openCalendar}
                          type={'button'}
                          color={'secondary'}
                          id="calendar-addon"
                        >
                          <CIcon icon={icon.cilCalendar} />
                        </CButton>
                      </CInputGroup>
                    )
                  }}
                />
              )}
            />
          </CCol>
          <CCol md={12}>
            <CFormLabel>Description</CFormLabel>
            <CFormTextarea {...register('description')} />
          </CCol>

          {/*<fieldset className={classes.fieldset}>*/}
          {/*  <legend className={classes.legend}>hehe</legend>*/}
          {/*  <CFormInput />*/}
          {/*</fieldset>*/}

          <CCol md={12}>
            <CMSFieldSet>
              <CMSLegend>Title</CMSLegend>
            </CMSFieldSet>
          </CCol>

          <CCol md={6}>
            <CFormLabel>Movie</CFormLabel>
            <CInputGroup className={'mb-3'}>
              <CFormInput
                value={vmName}
                aria-describedby={'inputGroupSelectMovie'}
                aria-label={'Select'}
                readOnly={true}
              />
              <CButton type={'button'} color={'secondary'} onClick={onSelectMovie}>
                Select
              </CButton>
              <MoviePopupList
                {...{ vmdId, setVmdId, setVmName, mdMovieVisible, setMdMovieVisible }}
              />
            </CInputGroup>
          </CCol>
          {/*<button onClick={handleClick}>{startDate.toDateString()}</button>*/}
          {/*<button type="button" onClick={() => reset(defaultValues)}>*/}
          {/*  Reset*/}
          {/*</button>*/}
        </CForm>
      </div>
    </CContainer>
  )
}

export default NestedForm
