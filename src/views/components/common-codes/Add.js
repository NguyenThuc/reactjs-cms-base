import React, { useEffect, useState } from 'react'
import { CForm, CFormInput, CContainer, CButton, CFormSwitch } from '@coreui/react'
import CommonCodeService from '../../../services/commonCodes.service'
import { toastError } from '../../../common/toast/ToastContainer'
import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'
import rename from 'deep-rename-keys'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { SingleErrorMessage } from '../../../common/custom-error-message/CustomErrorMessage'

const schema = yup
  .object()
  .shape({
    groupCode: yup.string().required(),
    code: yup.string().required().length(6),
    codeName: yup.string().required(),
  })
  .required()

const UpdateNodeComponent = ({ treeData, rowId, updateNode, action }) => {
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ resolver: yupResolver(schema), mode: 'onSubmit', reValidateMode: 'onSubmit' })

  /* add or update node tree  */
  const onDataSubmit = (data) => {
    updateNode(data)
  }

  const [data, setData] = useState({
    codeName: '',
    groupCode: '',
    description: '',
    useYn: false,
    code: '',
    extendValue1: '',
    extendValue2: '',
  })
  useEffect(() => {
    CommonCodeService.getCommonCodeById(rowId)
      .then((response) => {
        if (action === 'edit') {
          setData(response.data)
        }
      })
      .catch((err) => {
        toastError(err)
      })
  }, [rowId, action])

  const tree = rename(treeData, (key) => {
    if (key === 'title') return 'label'
    if (key === 'id') return 'value'
    return key
  })
  if (action === 'edit') {
    setValue('codeName', data.codeName)
    setValue('groupCode', data.groupCode)
    setValue('description', data.description)
    setValue('useYn', data.useYn)
    setValue('code', data.code)
    setValue('extendValue1', data.extendValue1)
    setValue('extendValue2', data.extendValue2)
  }
  if (action === 'add' && isSubmitSuccessful) {
    setValue('groupCode', '')
    setValue('codeName', '')
    setValue('description', '')
    setValue('useYn', false)
    setValue('code', '')
    setValue('extendValue1', '')
    setValue('extendValue2', '')
  }
  const onChangeTree = (currentNode) => {
    setValue('groupCode', currentNode.code)
  }

  return (
    <CContainer>
      <CForm className="g-3 needs-validation " onSubmit={handleSubmit(onDataSubmit)}>
        {action === 'edit' ? (
          <div>
            <h6 className="py-2">Group Code </h6>
            <CFormInput type="text" value={data.groupCode} readOnly />
          </div>
        ) : (
          <div>
            <h6 className="py-2"> Group Code </h6>
            <Controller
              control={control}
              render={() => (
                <DropdownTreeSelect
                  className="bootstrap-demo"
                  name="groupCode"
                  data={tree}
                  onChange={onChangeTree}
                  mode="radioSelect"
                />
              )}
            />
            <SingleErrorMessage name="groupCode" errors={errors} />
          </div>
        )}
        <h6 className="py-2"> Code </h6>
        <CFormInput type="text" {...register('code')} readOnly={action === 'edit' ? true : false} />
        <SingleErrorMessage name="code" errors={errors} />
        <h6 className="py-2"> Code Name </h6>
        <CFormInput type="text" {...register('codeName')} />
        <SingleErrorMessage name="codeName" errors={errors} />
        <h6 className="py-2"> Description </h6>
        <CFormInput type="text" {...register('description')} />
        <h6 className="py-2"> ExtendValue1 </h6>
        <CFormInput type="text" name="extendValue1" {...register('extendValue1')} />
        <h6 className="py-2"> ExtendValue2 </h6>
        <CFormInput type="text" name="extendValue2" {...register('extendValue2')} />
        <CFormSwitch
          name="useYn"
          className="py-2"
          size="lg"
          label="Use Yes or No"
          id="formSwitchCheckChecked"
          defaultChecked={action === 'edit' ? data.useYn : true}
          {...register('useYn')}
        />
        <CButton className="py-2 col text-center my-3 me-md-3" color="primary" type="submit">
          {action === 'edit' ? 'Update' : 'Submit'}
        </CButton>

        <CButton className="py-2 col text-center my-3" color="primary" onClick={() => reset()}>
          {'Reset'}
        </CButton>
      </CForm>
    </CContainer>
  )
}

export default UpdateNodeComponent
