import AISettingController from './AISettingController';
import Api from './Api';
import AppController from './AppController';
import Auth from './Auth';
import ContactController from './ContactController';
import DashboardController from './DashboardController';
import Hub from './Hub';
import MessageController from './MessageController';
import Settings from './Settings';

const Controllers = {
    Auth: Object.assign(Auth, Auth),
    DashboardController: Object.assign(
        DashboardController,
        DashboardController,
    ),
    ContactController: Object.assign(ContactController, ContactController),
    AppController: Object.assign(AppController, AppController),
    MessageController: Object.assign(MessageController, MessageController),
    AISettingController: Object.assign(
        AISettingController,
        AISettingController,
    ),
    Api: Object.assign(Api, Api),
    Settings: Object.assign(Settings, Settings),
    Hub: Object.assign(Hub, Hub),
};

export default Controllers;
