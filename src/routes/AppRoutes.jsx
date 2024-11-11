

import React from "react";
import { Route, Routes } from "react-router-dom";

// import Login from "../pages/login/login";
// import Home from "../pages/home/home";
import Empresa from "../pages/empresa/empresa";
import Perfil from "../pages/auth/Perfil/perfil";
import Usuarios from "../pages/usuarios/usurios";
import Variables from "../pages/variables/variables";
import TipoVariable from "../pages/tipoVariable/tipoVariables";
import Especies from "../pages/especies/especieCategoria";
import ListaEspecies from "../pages/listaEspecies/listaEspecie";
import CrearListas from "../pages/listaEspecies/crearLista";
import Monitoreo from "../pages/monitoreo/monitoreo";
import Tipos from "../pages/tiposDispositivos/tipos";
import Sensores from "../pages/Sensores/sensor";
import Actuadores from "../pages/Actuadores/actuador";
import Espacio from "../pages/espacioProduccion/espacio";
import TipoEspacio from "../pages/TipoEspacio/tipoEspacio";
import Seguimiento from "../pages/seguimiento/seguimiento";
import Lotes from "../pages/lotes/lotes";
import Dashboard from "../pages/dahsboard/dahsboard";
import LayoutHome from "../pages/Layouts/layout";
import AuthLogin from "../pages/auth/login";
import PasswordRecovery from "../pages/auth/passwordRecovery";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/passwordRecovery" element={<PasswordRecovery />} />
      <Route path="/" element={<AuthLogin />} />
      <Route path="perfil" element={<Perfil />} />
      <Route path="/home" element={<LayoutHome />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="empresa" element={<Empresa />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="variables" element={<Variables />} />
        <Route path="tipoVariables" element={<TipoVariable />} />
        <Route path="listaEspecie" element={<ListaEspecies />} />
        <Route path="crearLista" element={<CrearListas />} />
        <Route path="especies" element={<Especies />} />
        <Route path="monitoreo" element={<Monitoreo />} />
        <Route path="tipos" element={<Tipos />} />
        <Route path="sensor" element={<Sensores />} />
        <Route path="actuador" element={<Actuadores />} />
        <Route path="espacio" element={<Espacio />} />
        <Route path="tipoEspacio" element={<TipoEspacio />} />
        <Route path="lotes" element={<Lotes />} />
        <Route path="seguimiento" element={<Seguimiento />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
