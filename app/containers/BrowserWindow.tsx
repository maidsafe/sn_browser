import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { remote } from 'electron';

import * as TabActions from '$Actions/tabs_actions';
import * as NotificationActions from '$Actions/notification_actions';
import * as BookmarksActions from '$Actions/bookmarks_actions';
import * as WindowsActions from '$Actions/windows_actions';
import { Browser } from '$Components/Browser';
import { getActionsForBrowser } from '$Extensions';

const windowId = remote ? remote.getCurrentWindow().id : undefined;
function mapStateToProperties( state ) {
    return {
        bookmarks: state.bookmarks,
        notifications: state.notifications,
        tabs: state.tabs,
        history: state.history,
        windows: state.windows,
        windowId,
        safeBrowserApp: state.safeBrowserApp,
    };
}

function mapDispatchToProperties( dispatch ) {
    const extensionActions = getActionsForBrowser();
    const actions = {
        ...BookmarksActions,
        ...NotificationActions,
        ...TabActions,
        ...WindowsActions,

        ...extensionActions,
    };
    return bindActionCreators( actions, dispatch );
}

export const BrowserWindow = connect(
    mapStateToProperties,
    mapDispatchToProperties
)( Browser );
