import { describe, it } from 'mocha';
import { expect } from 'chai';
import SqlQueryBuilder from '../../../../../server/core/sql/builders/sqlQueryBuilder';
import * as _ from '../../../../../server/core/sql/sqlDataTypes';

describe('SqlQueryBuilder', () => {
   let subject;

   beforeEach(() => {
       subject = new SqlQueryBuilder('tableName', 'orderByColumnName');
   });

   context('buildExamples', () => {
        it('Should create simple sql query 1', () => {
            const actualClause = subject.from('Table').build();
            const expectedClause = 'select * from Table';
            expect(actualClause).to.equal(expectedClause);
        });

        it('Should create simple sql query 2', () => {
            const actualClause = subject.top(25).from('Table').build();
            const expectedClause = 'select top 25 * from Table';
            expect(actualClause).to.equal(expectedClause);
        });

        it('Should create simple sql query 3', () => {
            const actualClause = subject.select('columns').from('Table').build();
            const expectedClause = 'select columns from Table';
            expect(actualClause).to.equal(expectedClause);
        });

        it('Should create simple sql query 4', () => {
            const actualClause = subject.top(45).select('columns, multiple').from('Table').build();
            const expectedClause = 'select top 45 columns, multiple from Table';
            expect(actualClause).to.equal(expectedClause);
        });

        it('Should create simple sql query 5', () => {
            const actualClause = subject.top(45).select('columns, multiple').from('Table t')
                .join('secondTable s on s.column = t.column')
                .build();
            const expectedClause = 'select top 45 columns, multiple from Table t join secondTable s on s.column = t.column';
            expect(actualClause).to.equal(expectedClause);
        });

        it('Should create simple sql query 6', () => {
            const actualClause = subject.top(45).select('columns, multiple').from('Table t')
                .join('secondTable s on s.column = t.column')
                .join('thirdTable y on y.column = t.column')
                .build();
            const expectedClause = 'select top 45 columns, multiple from Table t join secondTable s on s.column = t.column join thirdTable y on y.column = t.column';
            expect(actualClause).to.equal(expectedClause);
        });

        it('Should create simple sql query 7', () => {
            const actualClause = subject.top(45).select('columns, multiple').from('Table t')
                .where('column = \'jon\'')
                .build();
            const expectedClause = 'select top 45 columns, multiple from Table t where column = \'jon\'';
            expect(actualClause).to.equal(expectedClause);
        });

        it('Should create simple sql query 8', () => {
            const actualClause = subject.select('columns, multiple').from('Table t')
                .where('column = \'jon\'')
                .or('orColumn = 4')
                .and('andColumn = 5')
                .build();
            const expectedClause = 'select columns, multiple from Table t where column = \'jon\' or orColumn = 4 and andColumn = 5';
            expect(actualClause).to.equal(expectedClause);
        });

        it('Should create simple sql query 9', () => {
            const actualClause = subject.select('columns, multiple').from('Table t')
                .where('column = \'jon\'')
                .or('orColumn = 4')
                .and('andColumn = 5')
                .orderByDesc('id')
                .build();
            const expectedClause = 'select columns, multiple from Table t where column = \'jon\' or orColumn = 4 and andColumn = 5 order by id desc';
            expect(actualClause).to.equal(expectedClause);
        });

        it('Should create simple sql query 10', () => {
            const actualClause = subject.select('columns, multiple').from('Table t')
                .where('column = \'jon\'')
                .orderBy('id')
                .build();
            const expectedClause = 'select columns, multiple from Table t where column = \'jon\' order by id asc';
            expect(actualClause).to.equal(expectedClause);
        });

        it('Should create simple sql query 11', () => {
            const actualClause = subject.select('s.random').select('t.columns').from('Table t')
                .join('SecondTable s on s.random = t.random')
                .where('t.id > 15')
                .and('s.column = 8')
                .build();
            const expectedClause = 'select s.random, t.columns from Table t join SecondTable s on s.random = t.random where t.id > 15 and s.column = 8';
            expect(actualClause).to.equal(expectedClause);
        });

        it('Should create simple sql query 12', () => {
            const modelId = 'A\'C\'M\'E';
            const modelIdExpectedValue = 'A\'\'C\'\'M\'\'E';
            const serialNumber = '\'dead%20beef?';
            const serialNumberExpectedValue = '\'\'dead%20beef?';
            const actualClause = subject.select('random').from('Table')
                .where('columnName = $ColumnName')
                .or('column2 = $SerialNumber')
                .or('column3 = $ModelId')
                .addParameter('$ColumnName', _.SqlVarCharType, 'escapedValue')
                .addParameter('$ModelId', _.SqlVarCharType, modelId)
                .addParameter('$SerialNumber', _.SqlVarCharType, serialNumber)
                .build();
            const expectedClause = `select random from Table where columnName = 'escapedValue' or column2 = '${serialNumberExpectedValue}' or column3 = '${modelIdExpectedValue}'`;
            expect(actualClause).to.equal(expectedClause);
        });

        it('Should create simple sql query 13', () => {
            const actualClause = subject.select('random').from('Table')
                .where('columnName = $ColumnName')
                .addParameter('$ColumnName', _.SqlIntType, 199)
                .build();
            const expectedClause = 'select random from Table where columnName = 199';
            expect(actualClause).to.equal(expectedClause);
        });
   });
});
