import React from 'react';
import  { Container } from './styles';
import ContentHeader from '../../components/ContentHeader';
import SelectInput from '../../components/SelectInput';

const Dashboard: React.FC = () => {

    const options = [
        {value: 'Bernardo', label: 'Bernardo'},
        {value: 'Ana', label: 'Ana'},
        {value: 'Julie', label: 'Julie'},
    ]

    return (
        <Container>
            <ContentHeader title="Dashboard" lineColor="#F7931B">
                <SelectInput  options={options} onChange={() => {}} />
            </ ContentHeader>
        </ Container>
    );
}

export default Dashboard;