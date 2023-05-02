export declare const microsoftSchemaQuery = "\n                SELECT\n                    TABLE_NAME,\n                    COLUMN_NAME,\n                    DATA_TYPE,\n                    CHARACTER_MAXIMUM_LENGTH,\n                    COLUMN_DEFAULT,\n                    IS_NULLABLE\n                FROM \n                    INFORMATION_SCHEMA.COLUMNS\n                WHERE \n                    TABLE_NAME = 'tableName'\n                ";
export declare const microsoftForeignKeyQuery = "\n                SELECT\n                  CONSTRAINT_NAME,\n                  TABLE_NAME,\n                  COLUMN_NAME,\n                  REFERENCED_TABLE_NAME,\n                  REFERENCED_COLUMN_NAME\n                FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS\n                WHERE \n                    COLUMN_NAME = 'columnName'\n                    AND REFERENCED_TABLE_NAME IS NOT NULL\n                    AND TABLE_NAME = 'tableName';\n              ";
//# sourceMappingURL=microsoft.queries.d.ts.map