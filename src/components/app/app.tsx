import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword,
} from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../slices/ingredientsSlice';
import { checkUserAuth } from '../../slices/userSlice';

import '../../index.css';

import styles from './app.module.css';

type TProtectedRouteProps = {
  children: React.ReactNode;
};

type TAppLocationState = {
  background?: ReturnType<typeof useLocation>;
};

const ProtectedRoute = ({ children }: TProtectedRouteProps): React.JSX.Element => {
  const { user, isAuthChecked } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

const OnlyUnAuthRoute = ({ children }: TProtectedRouteProps): React.JSX.Element => {
  const { user, isAuthChecked } = useSelector((state) => state.user);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const { ingredients, isLoading, error } = useSelector((state) => state.ingredients);

  const location = useLocation();
  const navigate = useNavigate();

  const locationState = location.state as TAppLocationState | null;
  const backgroundLocation = locationState?.background;

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);

  const closeModal = (): void => {
    void navigate(-1);
  };

  if (isLoading && ingredients.length === 0) {
    return <Preloader />;
  }

  if (error && ingredients.length === 0) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <p className={`${styles.message} text text_type_main-medium`}>
          Не удалось загрузить ингредиенты: {error}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />

        <Route
          path="/login"
          element={
            <OnlyUnAuthRoute>
              <Login />
            </OnlyUnAuthRoute>
          }
        />

        <Route
          path="/register"
          element={
            <OnlyUnAuthRoute>
              <Register />
            </OnlyUnAuthRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <OnlyUnAuthRoute>
              <ForgotPassword />
            </OnlyUnAuthRoute>
          }
        />

        <Route
          path="/reset-password"
          element={
            <OnlyUnAuthRoute>
              <ResetPassword />
            </OnlyUnAuthRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route path="/feed/:number" element={<OrderInfo />} />
        <Route path="/ingredients/:id" element={<IngredientDetails />} />

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path="/feed/:number"
            element={
              <Modal title="Информация о заказе" onClose={closeModal}>
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={closeModal}>
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute>
                <Modal title="Информация о заказе" onClose={closeModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
