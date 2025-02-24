

import React from "react";
import { Route, Routes } from "react-router-dom";

// import Login from "../pages/login/login";
// import Home from "../pages/home/home";
import Empresa from "../pages/empresa/empresa";
import VisualizarEmpresa from "../pages/empresa/visualizarEmpresa";
import Perfil from "../pages/usuarios/perfil";
import Usuarios from "../pages/usuarios/usurios";
import Variables from "../pages/variables/variables";
import TipoVariable from "../pages/tipoVariable/tipoVariables";
import Especies from "../pages/especies/especieCategoria";
import CrearCategorias from "../pages/especies/components/crearCategoria";
import EditarCategorias from "../pages/especies/components/editarCategoria";
import VisualizarCategoria from "../pages/especies/components/visualizarCategoria";
import ListaEspecies from "../pages/listaEspecies/listaEspecie";
import CrearListas from "../pages/listaEspecies/components/crearLista";
import EditarLista from "../pages/listaEspecies/components/editarLista";
import VisualizarLista from "../pages/listaEspecies/components/visualizarLista";
import Monitoreo from "../pages/monitoreo/monitoreo";
import VisualizarMonitoreo from "../pages/monitoreo/components/visualizarMonitoreo";
import Tipos from "../pages/tiposDispositivos/tipos";
import Sensores from "../pages/Sensores/sensor";
import Actuadores from "../pages/Actuadores/actuador";
import ViewEspacio from "../pages/espacioProduccion/components/viewEspacio";
import EditarEspacio from "../pages/espacioProduccion/components/editarEspacio";
import CrearEspacio from "../pages/espacioProduccion/components/crearEspacio";
import Espacio from "../pages/espacioProduccion/espacio";
import TipoEspacio from "../pages/TipoEspacio/tipoEspacio";
import Seguimiento from "../pages/seguimiento/seguimiento";
import Lotes from "../pages/lotes/lotes";
import VisualizarLote from "../pages/lotes/components/visualizarLote";
import Dashboard from "../pages/dahsboard/dahsboard";
import LayoutHome from "../pages/Layouts/layout";
import AuthLogin from "../pages/auth/login";
import PasswordRecovery from "../pages/auth/passwordRecovery";
import PrivateRoute from "../utils/privateRoute";
import ResetPassword from "../pages/auth/reset-password";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/passwordRecovery" element={<PasswordRecovery />} />
      <Route path="/" element={<AuthLogin />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />

      <Route path="/home" element={<PrivateRoute ><LayoutHome /></PrivateRoute>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="empresa" element={<Empresa />} />
        <Route path="visualizarEmpresa/:companyId" element={<VisualizarEmpresa/>} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="variables" element={<Variables />} />
        <Route path="tipoVariables" element={<TipoVariable />} />
        <Route path="listaEspecie" element={<ListaEspecies />} />
        <Route path="visualizarLista/:id" element={<VisualizarLista/>} />
        <Route path="editarLista/:id" element={<EditarLista/>} />
        <Route path="crearLista" element={<CrearListas />} />
        <Route path="crearCategoria" element={<CrearCategorias />} />
        <Route path="editarCategoria/:id" element={<EditarCategorias/>} />
        <Route path="visualizarCategoria/:id" element={<VisualizarCategoria/>} />
        <Route path="especies" element={<Especies />} />
        <Route path="monitoreo" element={<Monitoreo />} />
        <Route path="visualizarMonitoreo/:id" element={<VisualizarMonitoreo />} />
        <Route path="tipos" element={<Tipos />} />
        <Route path="sensor" element={<Sensores />} />
        <Route path="actuador" element={<Actuadores />} />
        <Route path="viewEspacio/:id" element={<ViewEspacio />} />
        <Route path="editarEspacio/:id" element={<EditarEspacio />} />
        <Route path="crearEspacio" element={<CrearEspacio />} />
        <Route path="espacio" element={<Espacio />} />
        <Route path="tipoEspacio" element={<TipoEspacio />} />
        <Route path="lotes" element={<Lotes />} />
        <Route path="visualizarLote/:id" element={<VisualizarLote />} />
        <Route path="seguimiento" element={<Seguimiento />} />

      </Route>
    </Routes>
  );
};

export default AppRoutes;
