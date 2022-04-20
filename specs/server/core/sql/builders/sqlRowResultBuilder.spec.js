import { describe, it } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import SqlRowResultBuilder from '../../../../../server/core/sql/builders/SqlRowResultBuilder';

describe('SqlRowResultBuilder', () => {
    let subject;

    beforeEach(() => {
        subject = new SqlRowResultBuilder();
    });

    context('endRow', () => {
        it('Should end the row and add the last row object', () => {
            subject.lastRow = {
                name: 'John Doe',
                age: 21,
            };

            const rowSpy = sinon.spy(subject.rows, 'push');

            subject.endRow();

            expect(rowSpy.calledOnce);
        });
    });

    context('addColumn', () => {
        it('Should set all columns to the expected values accordingly', () => {
            const testColumns = [
                {
                    metadata: {
                        colName: 'first',
                    },
                    value: 'John',
                },
                {
                    metadata: {
                        colName: 'last',
                    },
                    value: 'Doe',
                },
                {
                    metadata: {
                        colName: 'personType',
                    },
                    value: null,
                },
            ];

            testColumns.forEach((column) => {
                subject.addColumn(column);
            });

            expect(subject.lastRow.first).to.equal('John');
            expect(subject.lastRow.last).to.equal('Doe');
            expect(subject.lastRow.personType).to.equal(null);
        });
    });

    context('build', () => {
        it('Should return the list of rows gathered from the DB', () => {
            subject.rows.push('Franky');

            const actualRows = subject.build();
            expect(actualRows.length).to.equal(1);
        });
    });
});
