import * as React from 'react';
import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import DataTableNodeColumn from './DataTableNodeColumn';
import { FaRegPlusSquare } from 'react-icons/fa';
import useSettingsStore from '../../store/settingsStore';
import useDataStore from '../../store/dataStore';
import useSchemaStore from '../../store/schemaStore';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import informationIcon from '../../../images/informationSqIcon.png'

export default function DataTableNode({ data }) {  //this 'data' is created and passed from createdDataNodes, need DATA, not SCHEMA

  const [tableData, setTableData] = useState(data.table)
  const { setInputModalState } = useSettingsStore((state) => state);
  const { dataStore } = useDataStore((state) => state);
  const setDataStore = useDataStore((state) => state.setDataStore);
  const{ schemaStore } = useSchemaStore((state) => state);

  const infoIconStr: string = "Please strictly follow syntax of your database. Ex) leave blank for auto-generating values, primary key must have value, etc. It may cause an error in updating database if you not strictly follow the syntax." 

  const tableName = tableData[0];
  let firstRow =[]
  let restRowsData = []
  let secondaryFirstRow = []
  let RowData = Object.values(tableData[1]);

 //Used to grab the primary key and foreign keys column in the Table
 let schemaName = schemaStore[`public.${tableName}`];
 let PK = null;
 let FK = null
 let pkVals = new Set();
 for(let key in schemaName){
   if(schemaName[key]['IsForeignKey']) FK = schemaName[key].field_name;
   if(schemaName[key]['IsPrimaryKey']) PK = schemaName[key].field_name;
 }
 
//loop through all of RowData, grab each primary key value and store it in object<pkVals>
for(let i = 0; i < RowData.length; i++){
  pkVals.add(RowData[i][PK]);
}


  if (schemaName !== undefined) {
    secondaryFirstRow = Object.keys(schemaStore['public.' + tableName]);
  }

 //Filter out Schemas from data
  if(RowData[0] !== undefined){
    if (RowData[0].IsForeignKey === undefined) {
      firstRow = Object.keys(RowData[0]);
      restRowsData = [...RowData];
    }
 }else{
    firstRow = secondaryFirstRow
 }

//UseEffect set Table when the dataStore is changed after on Delete.
  useEffect(() => {  
    setTableData([tableName,dataStore[tableName]])
  }, [dataStore]);


 const deleteRow = async (value,index,id) => {
 
  restRowsData = restRowsData.slice(0,index).concat(restRowsData.slice(index+1,restRowsData.length))
  if(value[FK]!== null){
    alert(`Can't Delete Foreign Key: ${FK}`);
    throw new Error('Duplicate Primary Key');
  }
   setDataStore({...dataStore,[id]:restRowsData});


  const sendDeleteRequest = fetch(`/api/${dbCredentials.db_type}/deleteRow`,{
    method:'DELETE',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({tableName : tableName, primaryKey: PK, value: value[PK] })
  })
  
  ////////////////// Fetch path: /api/delete ///////////////////
  // {
  //  tableName: name of table,
  //  primaryKey: primary key,
  //  value: corresponding value of the primary key
  // }
  ////////////////////////////////////////////
  }

//cannot make handles for data table dynamic since size of each column can vary
//TODO: is there better way to assign handle?
  const tableHandles = [];
  for (let i = 0; i < data.edges.length; i++) {
    if (data.edges[i].source === tableName) {
      let columnNumberSource:number =
        firstRow.findIndex((eachColumnName) => eachColumnName === data.edges[i].sourceHandle) + 1;
      if (columnNumberSource === 0) columnNumberSource = 1;
      tableHandles.push(
        <Handle
          key={`${data.edges[i]}-source-${[i]}`}
          type="source"
          position={Position.Top}
          id={data.edges[i].sourceHandle}
          style={{
            background: 'transparent',
            // left: "25%" + ((columnNumberSource - 1) * 30)
            left: 62 + ((columnNumberSource-1)* 40)
          }}
        />
      );
    }
    if (data.edges[i].target === tableName) {
      let columnNumberTarget:number =
        firstRow.findIndex((obj) => obj.Name === data.edges[i].targetHandle) + 1;
      if (columnNumberTarget === 0) columnNumberTarget = 1;
      tableHandles.push(
        <Handle
          key={`${data.edges[i]}-target-${[i]}`}
          type="target"
          position={Position.Top}
          id={data.edges[i].targetHandle}
          style={{
            background: 'transparent',
            left: 15
          }}
        />
      );
    }
  } 

  return (
    <>
      <div className="table-node transition-colors duration-500" key={tableName}>
        <div className="flex items-center justify-between table-header relative bg-[#075985] dark:opacity-75">
          {tableHandles}
          <div>
            <label htmlFor="text" 
              className="bg-[#075985] dark:opacity-75 text-white text-stroke-black dark:bg-opacity-0" 
              style={{ 
                'marginLeft': '0px'
              }}>
              {tableName}
            </label>
          </div>
          <div className="addRowBtn ml-3 mb-1.5 flex position">
            <button
              className="add-field transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7] bg-transparent"
              onClick={() => setInputModalState(true, 'row', tableName)}
            >
              <FaRegPlusSquare size={20} className="text-white" />
            </button>
            <div className='mt-2 mr-2'>
              <Tippy content={infoIconStr} placement="top" trigger="mouseenter click">
                <img src={informationIcon} alt="Information Icon" className="h-3 rounded-full ml-0" />
              </Tippy>
            </div>
          </div>
        </div>
        <div
          style={{ maxHeight: "350px", maxWidth: "600px" }}
          className="nowheel overflow-auto scrollbar-hide"
        >
          <div className="table-bg transition-colors duration-500 dark:bg-slate-700">
            <table className="transition-colors duration-500 dark:text-[#fbf3de]">
              <thead>
                <tr className="head-column">
                  {firstRow?.map(each => (
                    <th
                      key={each}
                      scope="col"
                      className="transition-colors duration-500 dark:text-[#fbf3de]"
                    ><b>{each}</b>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
              {/* generates dynamic columns */}
                {restRowsData.map((row, index) =>{
                  return (
                    <DataTableNodeColumn
                      row={row}
                      key={`${tableName}-row${index}`}
                      id={tableName}
                      index={index}
                      deleteRow={deleteRow}
                      FK={FK}
                      PK={[PK,pkVals]}
                    />
                  )} 
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}