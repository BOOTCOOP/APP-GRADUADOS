import Vuex from 'vuex'

// Modules
import bibliographies from './modules/resources/bibliography/bibliographies';
import courses from './modules/resources/course/courses';
import feeds from './modules/resources/feed/feeds';
import home from './modules/resources/home/home';
import images from './modules/app/images';
import inscriptions from './modules/resources/inscription/inscriptions';
import interests from './modules/resources/interest/interests';
import jobs from './modules/resources/job/jobs';
import notifications from './modules/resources/notifications/notifications';
import ui from './modules/ui';
import workshops from './modules/resources/activity/workshops';

export default new Vuex.Store({
    strict: true,
    modules:{
        bibliographies,
        courses,
        feeds,
        home,
        images,
        inscriptions,
        interests,
        jobs,
        notifications,
        ui,
        workshops,
    }
})
