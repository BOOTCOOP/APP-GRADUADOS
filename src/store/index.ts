import Vuex from 'vuex'

// Modules
import images from './modules/app/images'
import quizzes from './modules/entertainment/quizzes'
import benefits from './modules/benefits/benefits'
import avisos from './modules/avisos/avisos'
import workshops from './modules/resources/activity/workshops'
import bibliographies from './modules/resources/bibliography/bibliographies'
import courses from './modules/resources/course/courses'
import feeds from './modules/resources/feed/feeds'
import home from './modules/resources/home/home'
import inscriptions from './modules/resources/inscription/inscriptions'
import interests from './modules/resources/interest/interests'
import jobs from './modules/resources/job/jobs'
import notifications from './modules/resources/notifications/notifications'
import ui from './modules/ui'

export default new Vuex.Store({
  strict: true,
  modules: {
    bibliographies,
    courses,
    feeds,
    home,
    images,
    benefits,
    avisos,
    inscriptions,
    interests,
    jobs,
    notifications,
    ui,
    workshops,
    quizzes,
  },
})
