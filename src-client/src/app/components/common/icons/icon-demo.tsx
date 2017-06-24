import { DirectoryIcon } from './directory';
import * as RX from 'reactxp';
import { createIconStyle } from './icon-base';
import { AddIcon } from './add';
import { AddressCardIcon } from './address-card';
import { ArrowRightIcon } from "./arrow-right";
import { BankIcon } from "./bank";
import { BedIcon } from "./bed";
import { CancelIcon } from "./cancel";
import { CheckIcon } from "./check";
import { CheckboxCheckedIcon } from "./checkbox-checked";
import { CheckboxEmptyIcon } from "./checkbox-empty";
import { CheckboxSolidIcon } from "./checkbox-solid";
import { ChurchIcon } from "./church";
import { ClearIcon } from "./clear";
import { CircleOpenIcon } from "./circle-open";
import { CompassIcon } from "./compass";
import { EditIcon } from "./edit";
import { EducationIcon } from "./education";
import { FamilyIcon } from "./family";
import { FaxIcon } from "./fax";
import { FitnessIcon } from "./fitness";
import { FoodIcon } from "./food";
import { HealthIcon } from "./health";
import { HomeIcon } from "./home";
import { LegalIcon } from "./legal";
import { LocalIcon } from "./local";
import { MenuIcon } from "./menu";
import { NewsIcon } from "./news";
import { PhoneIcon } from "./phone";
import { SearchIcon } from "./search";
import { TruckIcon } from "./truck";
import { WebIcon } from "./web";
import { SmsIcon } from "./sms";

const containerStyle = RX.Styles.createViewStyle({
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#000000',
});

const viewStyle = RX.Styles.createViewStyle({
    borderWidth: 2,
    borderColor: 'lime',
    borderStyle: 'solid',
});

const iconStyle = createIconStyle({
    fillColor: '#FFFFFF',
    fontSize: 20,
    padding: 0
});

export const IconDemo = () => (
    <RX.View style={containerStyle}>
        <RX.View style={viewStyle}><AddIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><AddressCardIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><ArrowRightIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><BankIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><BedIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><CancelIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><CheckIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><CheckboxCheckedIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><CheckboxEmptyIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><CheckboxSolidIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><ChurchIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><CircleOpenIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><ClearIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><CompassIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><DirectoryIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><EditIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><EducationIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><FamilyIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><FaxIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><FitnessIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><FoodIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><HealthIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><HomeIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><LegalIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><LocalIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><MenuIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><NewsIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><PhoneIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><SearchIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><SmsIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><TruckIcon style={iconStyle} /></RX.View>
        <RX.View style={viewStyle}><WebIcon style={iconStyle} /></RX.View>
    </RX.View>
);
