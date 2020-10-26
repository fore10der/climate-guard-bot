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
    chip_id: string
    measured_at?: number
    all_data?: {
        [key: string]: MeasureData
    }
}
