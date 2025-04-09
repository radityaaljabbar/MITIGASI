import React from 'react';
import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
} from 'react-router-dom';

import MainLayoutMahasiswa from './layout/MainLayoutMahasiswa';
import NotFoundPage from './pages/pagesMahasiswa/NotFoundPage';
//Importing the feature pages:
import MyProgress from './pages/pagesMahasiswa/MyProgress';
import MyCoursePage from './pages/pagesMahasiswa/MyCoursePage';
import MyWellnessPage from './pages/pagesMahasiswa/MyWellnessPage';
import MyWellness_Test from './pages/pagesMahasiswa/MyWellness_Test';

const App = () => {
    const kirimTestPsikologi = (jawabanTestPsikologi) => {
        console.log(jawabanTestPsikologi);
    };

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/student" element={<MainLayoutMahasiswa />}>
                <Route index element={<MyProgress />} />
                <Route path="/student/my-course" element={<MyCoursePage />} />
                <Route
                    path="/student/my-wellness"
                    element={<MyWellnessPage />}
                />
                <Route
                    path="/student/my-wellness/psi-test"
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
