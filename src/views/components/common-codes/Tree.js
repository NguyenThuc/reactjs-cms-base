import React, { useEffect, useState } from 'react'
import '@nosferatu500/react-sortable-tree/style.css'
import TreeView from './DragDrop'
import UpdateNodeComponent from './Add'
import { changeNodeAtPath, removeNodeAtPath } from '@nosferatu500/react-sortable-tree'
import { CCol, CContainer, CRow } from '@coreui/react'
import CommonCodeService from '../../../services/commonCodes.service'
import { toastError } from '../../../common/toast/ToastContainer'
import { ModalConfirmContext } from '../../../common/context/ModalConfirmContext'

const Tree = () => {
  const [treeData, setTreeData] = useState([])
  const [action, setAction] = useState('add')
  const [rowInfo, setRowInfo] = useState()
  const { setModalVisible, setModalConfig } = React.useContext(ModalConfirmContext)

  useEffect(() => {
    const code = '111111'
    CommonCodeService.getCommonByCode(code)
      .then((response) => {
        setTreeData(response.data)
      })
      .catch((err) => {
        console.error('Error ', err)
      })
  }, [])

  const updateTreeData = (data) => {
    //console.log('data_update', data)
    // for root only 1 menu parent
    if (data.length === 1) {
      setTreeData([...data])
      return true
    }
    return false
  }
  const onMoveNode = (node, nextParentNode) => {
    let array = []
    if (nextParentNode !== null && nextParentNode.children !== undefined) {
      nextParentNode.children.map(function (num, index) {
        return array.push({ displayOrder: index, id: num.id, title: num.title })
      })
      let object = [
        {
          children: array,
          parentId: nextParentNode.id,
        },
      ]
      CommonCodeService.reOrderCommonCode(object).then(() => {
        return true
      })
    } else {
      toastError('Not drag out tree parent')
    }
  }
  const editNode = (event) => {
    setRowInfo(event)
    setAction('edit')
  }

  const deleteNode = (rowInfo) => {
    setModalVisible(true)
    setModalConfig({
      title: {
        header: 'Delete (Tree Node)',
        body: 'Are you sure delete (Tree Node)?',
        footer: {
          confirm: 'Yes (Tree Node)',
          cancel: 'No (Tree Node)',
        },
      },
      onConfirm: () => {
        CommonCodeService.deleteCommonCode(rowInfo.node.id).then(() => {
          let removeNode = removeNodeAtPath({
            treeData: treeData,
            path: rowInfo.path,
            getNodeKey: ({ treeIndex: number }) => {
              return number
            },
          })
          updateTreeData(removeNode)
        })
      },
    })
  }

  const updateNode = (data) => {
    //console.log(data)
    let title = data.codeName + '(' + data.groupCode + ')'
    if (action === 'edit') {
      CommonCodeService.editCommonCode(rowInfo.node.id, data)
        .then((response) => {
          if (response.status === 200) {
            let currentNode = changeNodeAtPath({
              treeData: treeData,
              path: rowInfo.path,
              getNodeKey: ({ treeIndex }) => treeIndex,
              newNode: { ...rowInfo.node, title },
              ignoreCollapsed: true,
            })
            updateTreeData(currentNode)
            setAction('add')
          }
        })
        .catch((err) => {
          toastError(err)
        })
      setAction('add')
    } else {
      //console.log(data)
      CommonCodeService.registerCommonCode(data)
        .then((response) => {
          if (response.status === 201) {
            //  setTreeData([...treeData, { id: treeData.length, title: title }])
            setAction('add')
          } else {
            toastError(response.message)
          }
        })
        .catch((err) => {
          toastError(err)
        })
    }
  }
  return (
    <CContainer className="overflow-hidden">
      <CRow xs={{ gutterX: 5 }}>
        <CCol>
          <div className="p-3 border bg-white">
            <TreeView
              data={treeData}
              editNode={editNode}
              deleteNode={deleteNode}
              updateTreeData={updateTreeData}
              onMoveNode={onMoveNode}
              setAction={setAction}
            />
          </div>
        </CCol>
        <CCol>
          <div className="p-3 border bg-white">
            <UpdateNodeComponent
              treeData={treeData}
              rowId={rowInfo === undefined ? '' : rowInfo.node.id}
              updateNode={(data) => updateNode(data)}
              action={action}
            />
          </div>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Tree
