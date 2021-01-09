export interface BaseEntity {
    id: number;
}

export interface Building extends BaseEntity {
    title_building: string;
};

export interface Room extends BaseEntity {
    title_room: string;
}

enum Color {
    RED = 'red',
    ORANGE = 'orange',
    YELLOW = 'yellow',
    GREEN = 'green',
    BLUE = 'blue',
    PURPLE = 'purple'
}

interface MeasureData {
    label: string;
    value: number;
    measure: string;
    color: Color
}

export interface Box extends BaseEntity {
    room_id: number,
    building_id: number,
    name: string
    chip_id: string
    measured_at?: number
    all_data?: {
        [key: string]: MeasureData
    }
}

interface BaseNotification {
    label?: string
    measure?: string
}

interface Score {
    value?: string
    color?: Color
}

interface RegularNotification extends BaseNotification {
    max: Score
    min: Score
}

interface EventNotification extends BaseNotification, Score {
    type: string
    description: string
    event_time: string
}

interface NotificationsMap {
    event: EventNotification[]
    regular: RegularNotification[]
}

interface NotificationsData {
    last_reported: string
    reported_at: string
    box_id: number
    uuid: string
    name: string
    room_id: number
    room_title: string
    building_id: number
    building_title: string
    notifications: NotificationsMap
}

export interface NotificationsResponse extends BaseEntity {
    message: string,
    data: NotificationsData
}
