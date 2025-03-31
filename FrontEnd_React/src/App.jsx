import React from 'react';
import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
} from 'react-router-dom';

import MainLayout from './layout/MainLayout';
import NotFoundPage from './pages/NotFoundPage';
//Importing the feature pages:
import MyProgress from './pages/MyProgress';
import MyCoursePage from './pages/MyCoursePage';
import MyWellnessPage from './pages/MyWellnessPage';
import MyWellness_Test from './pages/MyWellness_Test';

const App = () => {
    const kirimTestPsikologi = (jawabanTestPsikologi) => {
        console.log(jawabanTestPsikologi);
    };

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<MainLayout />}>
                <Route index element={<MyProgress />} />
                <Route path="/my-course" element={<MyCoursePage />} />
                <Route path="/my-wellness" element={<MyWellnessPage />} />
                <Route
                    path="/my-wellness/psi-test"
                    element={
                        <MyWellness_Test
                            submitTestPsikologi={kirimTestPsikologi}
                        />
                    }
                />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        )
    );

    return <RouterProvider router={router} />;
};

export default App;
