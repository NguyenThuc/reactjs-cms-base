import React, { useEffect, useState } from 'react'
import '@nosferatu500/react-sortable-tree/style.css'
import SortableTree, { toggleExpandedForAll } from '@nosferatu500/react-sortable-tree'
//import FileExplorerTheme from 'react-sortable-tree-theme-minimal'
import FileExplorerTheme from 'react-sortable-tree-theme-full-node-drag'
import { CButton } from '@coreui/react'
import { DeleteOutlined, EditOutlined } from '@material-ui/icons'
const TreeView = ({ data, editNode, deleteNode, updateTreeData, onMoveNode, setAction }) => {
  const [treeData, setTreeData] = useState([])
  useEffect(() => {
    setTreeData(data)
  }, [data])

  // Expand and collapse code
  const expand = (expanded) => {
    setTreeData(
      toggleExpandedForAll({
        treeData: treeData,
        expanded,
      }),
    )
  }

  const expandAll = () => {
    expand(true)
  }

  const collapseAll = () => {
    expand(false)
  }
  // Expand and collapse code  end

  return (
    <div className={'wrap-common-tre'}>
      <div className={'head-common-tre'}>
        <h3>Common Code Tree </h3>
        <CButton className="me-md-2" color="primary" size="sm" onClick={expandAll}>
          Expand All
        </CButton>
        <CButton color="primary" className={'me-md-5'} size="sm" onClick={collapseAll}>
          Collapse All
        </CButton>
        <CButton
          className={'float-right mt-1 ms-xl-3'}
          color="primary"
          size="sm"
          onClick={() => setAction('add')}
        >
          Add New Node
        </CButton>
      </div>

      <SortableTree
        className="tree-dt"
        id="add_name"
        treeData={treeData}
        rowDirection="ltr"
        onChange={updateTreeData}
        onMoveNode={({ node, nextParentNode }) => {
          onMoveNode(node, nextParentNode)
        }}
        generateNodeProps={(rowInfo) => ({
          listIndex: 0,
          lowerSiblingCounts: [],
          buttons: [
            <div className={'btn-tree'} key="delete">
              <DeleteOutlined
                className={'btn-action-tree'}
                key={rowInfo}
                color={'error'}
                onClick={() => deleteNode(rowInfo)}
              />
              <EditOutlined
                key="edit"
                className={'btn-action-tree'}
                onClick={() => editNode(rowInfo)}
              />
            </div>,
          ],
          style: {
            height: '50px',
          },
        })}
        theme={FileExplorerTheme}
      />
    </div>
  )
}

export default TreeView
