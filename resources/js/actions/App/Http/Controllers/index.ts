import Auth from './Auth'
import DashboardController from './DashboardController'
import ContactController from './ContactController'
import AppController from './AppController'
import MessageController from './MessageController'
import AISettingController from './AISettingController'
import Api from './Api'
import Settings from './Settings'
import Hub from './Hub'

const Controllers = {
    Auth: Object.assign(Auth, Auth),
    DashboardController: Object.assign(DashboardController, DashboardController),
    ContactController: Object.assign(ContactController, ContactController),
    AppController: Object.assign(AppController, AppController),
    MessageController: Object.assign(MessageController, MessageController),
    AISettingController: Object.assign(AISettingController, AISettingController),
    Api: Object.assign(Api, Api),
    Settings: Object.assign(Settings, Settings),
    Hub: Object.assign(Hub, Hub),
}

export default Controllers