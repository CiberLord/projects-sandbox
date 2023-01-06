import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Page } from '../components/Page';
import { MainPage } from './MainPage';

export const Router: React.FC = () => {
    return (
        <BrowserRouter>
            <Page>
                <Routes>
                    <Route
                        path='/'
                        element={<MainPage />}
                    />
                </Routes>
            </Page>
        </BrowserRouter>
    );
};
