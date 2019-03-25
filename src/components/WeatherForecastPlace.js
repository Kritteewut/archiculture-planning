/* eslint-disable react/prop-types, react/jsx-handler-names */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import Button from '@material-ui/core/Button';
import { TMDAPIKey } from '../config/TMD';
import { provinces, amphoes,tambons } from '../StaticValue/Places'


const styles = theme => ({
    root: {
        flexGrow: 1,
        height: 250,
    },
    input: {
        display: 'flex',
        padding: 0,
    },
    valueContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flex: 1,
        alignItems: 'center',
        overflow: 'hidden',
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    chipFocused: {
        backgroundColor: emphasize(
            theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
            0.08,
        ),
    },
    noOptionsMessage: {
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    },
    singleValue: {
        fontSize: 16,
    },
    placeholder: {
        position: 'absolute',
        left: 2,
        fontSize: 16,
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    divider: {
        height: theme.spacing.unit * 2,
    },
});

function NoOptionsMessage(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.noOptionsMessage}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} {...props} />;
}

function Control(props) {
    return (
        <TextField
            fullWidth
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps.classes.input,
                    inputRef: props.innerRef,
                    children: props.children,
                    ...props.innerProps,
                },
            }}
            {...props.selectProps.textFieldProps}
        />
    );
}

function Option(props) {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400,
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    );
}

function Placeholder(props) {
    return (
        <Typography
            color="textSecondary"
            className={props.selectProps.classes.placeholder}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    );
}

function SingleValue(props) {
    return (
        <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
            {props.children}
        </Typography>
    );
}

function ValueContainer(props) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
    return (
        <Chip
            tabIndex={-1}
            label={props.children}
            className={classNames(props.selectProps.classes.chip, {
                [props.selectProps.classes.chipFocused]: props.isFocused,
            })}
            onDelete={props.removeProps.onClick}
            deleteIcon={<CancelIcon {...props.removeProps} />}
        />
    );
}

function Menu(props) {
    return (
        <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
            {props.children}
        </Paper>
    );
}

const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
};


class WeatherForecast extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            province: null,
            amphoe: null,
            tambon: null,
        }
    }
    componentWillMount() {
       
    }
    handleChange = name => value => {
        this.setState({ [name]: value }, () => console.log(this.state.province));
    };
    onForecastWheaterFromPlace = () => {
        let url = 'https://data.tmd.go.th/nwpapi/v1/forecast/location/daily/place?province=นครปฐม&amphoe=สามพราน&fields=tc_min,tc_max,rh,cond,rain&duration=30'
        fetch(url, {
            method: "get",
            headers: {
                authorization: TMDAPIKey,
                accept: "application/json",
            },
        })
            .then(res => res.json())
            .then((result) => {
                console.log(result.WeatherForecasts)
            }, (error) => {
                console.log(error)
            }) 
    }
    render() {
        const { classes, theme } = this.props;
        const { province, amphoe, tambon } = this.state;
        const selectStyles = {
            input: base => ({
                ...base,
                color: theme.palette.text.primary,
                '& input': {
                    font: 'inherit',
                },
            }),
        };
        return (
            <div className={classes.root}>
                <NoSsr>
                    <Select
                        classes={classes}
                        styles={selectStyles}
                        options={provinces}
                        components={components}
                        value={province}
                        onChange={this.handleChange('province')}
                        placeholder="ค้นหาจังหวัด"
                        isClearable
                        textFieldProps={{
                            label: 'จังหวัด',
                            InputLabelProps: {
                                shrink: true,
                            },
                        }}
                    />
                    <div className={classes.divider} />
                    <Select
                        isDisabled={province ? false : true}
                        classes={classes}
                        styles={selectStyles}
                        options={province ? amphoes[province.value] : []}
                        components={components}
                        value={amphoe}
                        onChange={this.handleChange('amphoe')}
                        placeholder="ค้นหาอำเภอหรือเขต"
                        isClearable
                        textFieldProps={{
                            label: 'อำเภอหรือเขต',
                            InputLabelProps: {
                                shrink: true,
                            },
                        }}
                    />
                    <div className={classes.divider} />
                    <Select
                        isDisabled={amphoe ? false : true}
                        classes={classes}
                        styles={selectStyles}
                        options={amphoe ? tambons[amphoe.value] : []}
                        components={components}
                        value={tambon}
                        onChange={this.handleChange('tambon')}
                        placeholder="ค้นหาตำบลหรือเขต"
                        isClearable
                        textFieldProps={{
                            label: 'ตำบลหรือแขวง',
                            InputLabelProps: {
                                shrink: true,
                            },
                        }}
                    />
                    <div className={classes.divider} />
                    <Button
                        onClick={this.onForecastWheaterFromPlace}
                        disabled={province ? false : true}
                    >
                        อิงจากสถานที่
                    </Button>
                </NoSsr>
            </div>
        );
    }
}

WeatherForecast.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(WeatherForecast);
