import React , {useMemo, useState, useEffect} from 'react';
import { uuid } from 'uuidv4';
import {Container, Content, Filters } from './styles';
import ContentHeader from '../../components/ContentHeader';
import SelectInput from '../../components/SelectInput';
import HistoryFinnanceCard from '../../components/HistoryFinnanceCard';
import gains from '../../repositories/gains';
import expenses from '../../repositories/expenses';
import formatCurrency from '../../utils/formatCurrency';
import formatDate from '../../utils/formatDate';
import listOfMonths from '../../utils/months';

interface IRouteParams {
    match: {
        params: {
            type: string;
        }
    }
}

interface IData {
    id: string;
    description: string;
    amountFormatted: string;
    frequency: string;
    dateFormatted: string;
    tagColor: string;

}

const List: React.FC<IRouteParams> = ({ match }) => {
    const [data, setData] = useState<IData[]>([]);
    const [monthSelected, setMonthSelected] = useState<string>(String(new Date().getMonth() + 1));
    const [yearSelected, setYearSelected] = useState<string>(String(new Date().getFullYear));
    const [frequencyFilterSelected, setFrequencyFilterSelected] = useState(['recorrente', 'eventual']);
    const movimentType = match.params.type;

    const pageData = useMemo(() => {
        return movimentType === 'entry-balance' ?
            {
                title: 'Entradas',
                lineColor: '#F7931B',
                data: gains
            }
            :
            {
                title: 'Saídas',
                lineColor: '#E44C4E',
                data: expenses
            }
    },[movimentType]);

     const years = useMemo(() => {
        let uniqueYears: number[] = [];
        const { data } = pageData;
        data.forEach(item => {
             const date = new Date(item.date);
             const year = date.getFullYear();
             if(!uniqueYears.includes(year)){
                 uniqueYears.push(year)
             }
         });
         return uniqueYears.map(year => {
             return {
                 value: year,
                 label: year,
             }
         });
     },[pageData])

     const months = useMemo(() => {
        return listOfMonths.map((month, index) => {
            return {
                value: index + 1,
                label: month,
            }
        });
        },[]);

        const handleFrequencyClick = (frequency: string) => {
            const alreadySelected = frequencyFilterSelected.findIndex(item => item === frequency);
            if(alreadySelected >= 0){
                const filtered = frequencyFilterSelected.filter(item => item != frequency);
                setFrequencyFilterSelected(filtered);
            }else{
                setFrequencyFilterSelected((prev) => [...prev, frequency]);
            }    
        }

    useEffect (() => {
       const { data } = pageData;
       const filteredDate = data.filter(item => {
            const date = new Date(item.date);
            const month = String(date.getMonth() + 1);
            const year = String(date.getFullYear);
            return month === monthSelected && year === yearSelected && frequencyFilterSelected.includes(item.frequency);
       });
       const formattedData = filteredDate.map(item => {
            return {
                id: uuid(),
                description: item.description,
                amountFormatted: formatCurrency(Number(item.amount)),
                frequency: item.frequency,
                dateFormatted: formatDate(item.date),
                tagColor: item.frequency === 'recorrente' ? '#4E41F0' : '#E44C4E'
            }
        });
        setData(formattedData)
    },[pageData, monthSelected, yearSelected, data.length, frequencyFilterSelected]);

    return (
        <Container>
            <ContentHeader title={pageData.title} lineColor={pageData.lineColor}>
                <SelectInput  options={months} onChange={(e) => setMonthSelected(e.target.value)} defaultValue={monthSelected}/>
                <SelectInput  options={years} onChange={(e) => setYearSelected(e.target.value)}defaultValue={yearSelected}/>
            </ ContentHeader>

            <Filters>
                <button 
                    type="button"
                    className={`tag-filter tag-filter-recurrent
                        ${frequencyFilterSelected.includes('recorrente') && 'tag-actived' }`}
                    onClick={() => handleFrequencyClick('recorrente')}
                >
                    Recorrentes
                </button>
                <button 
                    type="button"
                    className={`tag-filter tag-filter-eventual
                    ${frequencyFilterSelected.includes('eventual') && 'tag-actived' }`}
                    onClick={() => handleFrequencyClick('eventual')}
                >
                    Eventuais
                </button>
            </Filters>

            <Content>
                {
                    data.map(item => (
            <HistoryFinnanceCard 
                    key={item.id}
                    tagColor={item.tagColor}
                    title={item.description}
                    subtitle={item.dateFormatted}
                    amount={item.amountFormatted}
                />
                    ))
                }
            </Content>
        </Container>        
    );
}

export default List;