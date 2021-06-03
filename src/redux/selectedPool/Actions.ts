import { IPool } from '~/models/Pool';
import { Database } from '~/repository/Database';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { IPoolNoId } from '~/models/Pool/IPool';

export const saveNewPool = createAsyncThunk('pool/save', (pool: IPoolNoId) => {
    Database.saveNewPool(pool);
    return pool;
});

export const updatePool = createAsyncThunk('pool/update', (pool: IPool) => {
    Database.updatePool(pool);
    return pool;
});

export const selectPool = createAction('pool/select', (pool: IPool) => {
    return {
        payload: pool,
    };
});

export const deletePool = createAsyncThunk('pool/delete', (pool: IPool) => {
    Database.deletePool(pool);
});

export const clearPool = createAction('pool/clear');
