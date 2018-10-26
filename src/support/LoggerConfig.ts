import Color from './color';

interface LoggerConfig {
    colors?: Color,
    beauty?: boolean,
    collapsed?: boolean,
    detailed?: boolean,
    logger?: Object,
    ignore?: string[],
    details?: string[],
}

export default LoggerConfig