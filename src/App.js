import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {goBack, closeModal, setStory} from "./js/store/router/actions";
import * as VK from './js/services/VK';

import Epic from '@vkontakte/vkui/dist/components/Epic/Epic';
import View from '@vkontakte/vkui/dist/components/View/View';
import Root from '@vkontakte/vkui/dist/components/Root/Root';
import Tabbar from '@vkontakte/vkui/dist/components/Tabbar/Tabbar';
import ModalRoot from '@vkontakte/vkui/dist/components/ModalRoot/ModalRoot';
import TabbarItem from '@vkontakte/vkui/dist/components/TabbarItem/TabbarItem';
import ConfigProvider from '@vkontakte/vkui/dist/components/ConfigProvider/ConfigProvider';

import Icon28Newsfeed from '@vkontakte/icons/dist/28/newsfeed';
import Icon28More from '@vkontakte/icons/dist/28/more';

import HomePanelBase from './js/panels/home/base';
import HomePanelGroups from './js/panels/home/groups';

import MorePanelBase from './js/panels/more/base';
import MorePanelExample from './js/panels/more/example';

import HomeBotsListModal from './js/components/modals/HomeBotsListModal';
import HomeBotInfoModal from './js/components/modals/HomeBotInfoModal';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.lastAndroidBackAction = 0;
    }

    componentWillMount() {
        const {goBack, dispatch} = this.props;

        dispatch(VK.initApp());

        window.onpopstate = () => {
            if (this.props.panelsHistory.length > 2) {
                let timeNow = +new Date();

                if (timeNow - this.lastAndroidBackAction > 500) {
                    this.lastAndroidBackAction = timeNow;

                    this.props.goBack('Android');
                } else {
                    window.history.pushState(null, null, window.location.url);
                }
            } else {
                goBack('Android');
            }
        };
    }

    render() {
        const {goBack, setStory, closeModal, popouts, activeView, activeStory, activePanel, activeModals, panelsHistory, colorScheme} = this.props;

        let history = (panelsHistory[activeView] === undefined) ? [activeView] : panelsHistory[activeView];
        let popout = (popouts[activeView] === undefined) ? null : popouts[activeView];
        let activeModal = (activeModals[activeView] === undefined) ? null : activeModals[activeView];

        const homeModals = (
            <ModalRoot activeModal={activeModal}>
                <HomeBotsListModal
                    id="MODAL_PAGE_BOTS_LIST"
                    onClose={() => closeModal()}
                />
                <HomeBotInfoModal
                    id="MODAL_PAGE_BOT_INFO"
                    onClose={() => closeModal()}
                />
            </ModalRoot>
        );

        return (
            <ConfigProvider isWebView={true} scheme={colorScheme}>
                <Epic activeStory={activeStory} tabbar={
                    <Tabbar>
                        <TabbarItem
                            onClick={() => setStory('home', 'base')}
                            selected={activeStory === 'home'}
                        ><Icon28Newsfeed/></TabbarItem>
                        <TabbarItem
                            onClick={() => setStory('more', 'callmodal')}
                            selected={activeStory === 'more'}
                        ><Icon28More/></TabbarItem>
                    </Tabbar>
                }>
                    <Root id="home" activeView={activeView} popout={popout}>
                        <View
                            id="home"
                            modal={homeModals}
                            activePanel={activePanel}
                            history={history}
                            onSwipeBack={() => goBack()}
                        >
                            <HomePanelBase id="base" withoutEpic={false}/>
                            <HomePanelGroups id="groups"/>
                        </View>
                    </Root>
                    <Root id="more" activeView={activeView} popout={popout}>
                        <View
                            id="more"
                            modal={homeModals}
                            activePanel={activePanel}
                            history={history}
                            onSwipeBack={() => goBack()}
                        >
                            <MorePanelBase id="callmodal"/>
                        </View>
                        <View
                            id="modal"
                            modal={homeModals}
                            activePanel={activePanel}
                            history={history}
                            onSwipeBack={() => goBack()}
                        >
                            <MorePanelExample id="filters"/>
                        </View>
                    </Root>
                </Epic>
            </ConfigProvider>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        activeView: state.router.activeView,
        activePanel: state.router.activePanel,
        activeStory: state.router.activeStory,
        panelsHistory: state.router.panelsHistory,
        activeModals: state.router.activeModals,
        popouts: state.router.popouts,

        colorScheme: state.vkui.colorScheme
    };
};


function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({setStory, goBack, closeModal}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);