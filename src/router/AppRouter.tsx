import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink
} from "react-router-dom";
import { Layout, Menu } from 'antd';
import { Dashboard } from '../components/dashboard/Dashboard';
import { CreateDoctor } from "../components/createDoctor/CreateDoctor";
const { Header } = Layout;




export const AppRouter = () => {
    return (
        <Router>
            <Layout className="layout">
                <Header>
                    <Menu theme="dark" mode="horizontal">
                        <Menu.Item key="1"><NavLink to='/dashboard'>Inicio</NavLink></Menu.Item>
                        <Menu.Item key="2"><NavLink to='/create'>Nuevo Profesional</NavLink></Menu.Item>
                    </Menu>
                </Header>

            </Layout>
            <div>
                <Switch>
                    <Route path="/dashboard">
                        <Dashboard />
                    </Route>
                    <Route path="/create">
                        <CreateDoctor />
                    </Route>
                    <Route path="/">
                        <Dashboard />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}
