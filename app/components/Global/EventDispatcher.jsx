export default class EventDispatcher {
    constructor() {
        console.log('Event Dispatcher ready');
    }
    handle(event) {
        switch (event.target) {
            case 'menu':
                console.log('Dispatching to Menu');
            break;
        }
    }
};

export var event_dispatcher = new EventDispatcher();