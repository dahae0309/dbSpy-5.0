import React from 'react';
import { useState, useEffect } from 'react';
import useSchemaStore from '../../store/schemaStore';
import useSettingsStore from '../../store/settingsStore';
import {
  FaRegEdit,
  FaRegTrashAlt,
  FaRegSave,
  FaRegCheckSquare,
  FaRegWindowClose,
} from 'react-icons/fa';
import DataTypeOptions from '../Modals/DataTypeOptions';
import { ColumnSchema, SQLDataType } from '@/Types';

export default function TableNodeColumn({
  column,
  id,
}: {
  column: ColumnSchema;
  id: string;
}) {
  const { schemaStore, setSchemaStore, deleteColumnSchema } = useSchemaStore(
    (state) => state
  );
  const { setEditRefMode } = useSettingsStore((state) => state);

  // Columns can be in one of three modes: default, edit, or delete
  const [mode, setMode] = useState('default');
  const [checked, setChecked] = useState(false);

  const newColumn = JSON.parse(JSON.stringify(column))
  const [columnData, setColumnData] = useState<ColumnSchema>({ ...newColumn });
  

  useEffect(()=> {
    setColumnData({...newColumn})
  },[column])

  // useEffect(() => {
  //   if (checked === false) {
  //     setChecked(true)
  //   } else {
  //     setChecked(false)
  //   };
  // },[checked]);


  const onSave = () => {
    const currentSchema = { ...schemaStore };
    currentSchema[columnData.TableName][columnData.field_name] = {
      ...columnData,
      // References was updated by AddReference modal, this avoids that change being overwritten
      References: currentSchema[columnData.TableName][columnData.field_name].References,
    };
    // If column name has changed, delete entry with old column name
    if (column.field_name !== columnData.field_name) {
      delete currentSchema[column.TableName][column.field_name];
    }
    setSchemaStore(currentSchema);
    setMode('default');
  };

  const onDelete = () => {
    //declare prior values
    const tableRef = columnData.TableName;
    const colRef = columnData.field_name;
    deleteColumnSchema(tableRef, colRef);
  };

  const openAddReferenceModal = () => {
    // document.querySelector('#mySideNav').style.width = '400px';
    // document.querySelector('#main').style.marginRight = '400px';
    setEditRefMode(true, columnData.TableName, columnData.Name);
  };

  return (
    <>
      {/* TODO: SEE ABOUT DELETING KEY ATTRIBUTE AND ID ATTRIBUTES */}
      <tr key={column.field_name} id={column.field_name} className="dark:text-[#f8f4eb] ">
        <td className="dark:text-[#f8f4eb]" id={`${id}-field_name`}>
          {mode === 'edit' ? (
            <input
              className="bg-[#f8f4eb] hover:shadow-md focus:outline-1 dark:text-black"
              value={columnData.field_name}
              onChange={(e) =>
                setColumnData((prevData) => ({
                  ...prevData,
                  Name: e.target.value,
                  field_name: e.target.value.replaceAll(/\s/g, '_'),
                }))
              }
            ></input>
          ) : (
            columnData.field_name
          )}
        </td>
        <td className="dark:text-[#f8f4eb]" id={`${id}-data_type`}>
          {mode === 'edit' ? (
            <select
              className="bg-[#f8f4eb] dark:text-black"
              value={columnData.data_type}
              onChange={(e) =>
                setColumnData((prevData) => ({
                  ...prevData,
                  data_type: e.target.value as SQLDataType,
                }))
              }
            >
              <DataTypeOptions />
            </select>
          ) : (
            columnData.data_type
          )}
        </td>
        <td className="dark:text-[#f8f4eb]" id={`${id}-additional_constraints`}>
          {mode === 'edit' ? (
            <select
              className="bg-[#f8f4eb] dark:text-black"
            >
              {/* TODO: CHANGE TO NULLABLE BOOLEAN */}
              <option value="NA">NA</option>
              <option value="NOT NULL">NOT NULL</option>
              <option value="PRIMARY">PRIMARY</option>
              <option value="UNIQUE">UNIQUE</option>
            </select>
          ) : (
            columnData.additional_constraints
          )}
        </td>
        <td className="dark:text-[#f8f4eb]" id={`${id}-IsPrimaryKey`}>
          {`${columnData.IsPrimaryKey}`}
        </td>
        <td className="dark:text-[#f8f4eb]" id={`${id}-IsForeignKey`}>
          {mode === 'edit' ? (
            <input
              type="checkbox"
              className="bg-[#f8f4eb] dark:text-black"
              checked={columnData.IsForeignKey}
              onChange={() => {
                // don't allow if only one table
                if (Object.keys(schemaStore).length <= 1) {
                  return window.alert(
                    'Must have more than one table to create foreign key constraints'
                  );
                }
                setColumnData((prevData) => {
                  return {
                    ...prevData,
                    IsForeignKey: !prevData.IsForeignKey,
                  };
                });
                // if box is now checked (state hasn't updated yet), open fk modal
                if (!columnData.IsForeignKey) openAddReferenceModal();
              }}
            />
          ) : (
              `${columnData.IsForeignKey}`
          )}
        </td>
        <td className="dark:text-[#f8f4eb]">
          {mode === 'edit' ? (
            <button
              id={`${id}-saveBtn`}
              onClick={onSave}
              className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]"
            >
              <FaRegSave size={17} />
            </button>
          ) : mode === 'delete' ? (
            <button
              id={`${id}-confirmBtn`}
              onClick={() => {
                onDelete();
                setMode('default');
              }}
              className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]"
            >
              <FaRegCheckSquare size={17} />
            </button>
          ) : (
            <button
              id={`${id}-editBtn`}
              onClick={() => setMode('edit')}
              className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]"
              data-testid="edit-column"
            >
              <FaRegEdit size={17} />
            </button>
          )}
        </td>
        <td className="transition-colors duration-500 hover:text-[#618fa7] dark:text-[#fbf3de] dark:hover:text-[#618fa7]">
          {mode === 'edit' ? (
            <button
              id={`${id}-cancelBtn`}
              onClick={() => {
                setColumnData({ ...column });
                setMode('default');
              }}
            >
              <FaRegWindowClose size={17} />
            </button>
          ) : mode === 'delete' ? (
            <button id={`${id}-cancelBtn`} onClick={() => setMode('default')}>
              <FaRegWindowClose size={17} />
            </button>
          ) : (
            <button id={`${id}-deleteBtn`} onClick={() => setMode('delete')}>
              <FaRegTrashAlt size={17} />
            </button>
          )}
        </td>
      </tr>
    </>
  );
}
