import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { BsFillGearFill } from 'react-icons/bs';
import { AiOutlinePlus } from 'react-icons/ai';
import { HiOutlineEmojiSad } from 'react-icons/hi';
import {
  Container, SectionContent, MealsContainer, Filters, FiltersButtonContainer,
  Header, MacrosContainer, DataSearch, Group,
} from './styles';

import { Base } from '../../templates/Base';

import api from '../../api/api';
import urlConfig from '../../urlConfig.json';

import { MealCard } from '../../components/MealCard';
import { Select } from '../../components/Select';
import { InputForm } from '../../components/InputForm';

interface MealProps {
  vegetablesamount: number,
  proteinsamount: number,
  carbohydratesamount: number,
  carbohydratefood: string,
  proteinfood: string,
  vegetablefood: string,
  meal: string,
  date: string,
  id: string,
  reference: string
}

export function User() {
  const [mealsData, setMealsData] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isDataFiltered, setIsDataFiltered] = useState(false);
  const [vegetablesFilter, setVegetablesFilter] = useState('');
  const [proteinsFilter, setProteinsFilter] = useState('');
  const [carbohydratesFilter, setCarbohydratesFilter] = useState('');
  const [mealFilter, setMealFilter] = useState('');
  const [totalProteins, setTotalProteins] = useState(0);
  const [totalVegetables, setTotalVegetables] = useState(0);
  const [totalCarbohydrates, settotalCarbohydrates] = useState(0);
  const [initialDate, setInitialDate] = useState('');
  const [finalDate, setFinalDate] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const authToken: any = localStorage.getItem('token');

    if (!authToken) {
      window.location.href = `${urlConfig.frontendURL}/`;
    }

    api.defaults.headers.authorization = `Bearer ${JSON.parse(authToken)}`;

    api.get(`/meals/${id}`)
      .then(async (response: any) => {
        setMealsData(response.data);
      });
  }, []);

  useEffect(() => {
    let proteins = 0;
    let vegetables = 0;
    let carbohydrates = 0;

    mealsData.map((meal: MealProps) => {
      proteins += meal.proteinsamount;
      vegetables += meal.vegetablesamount;
      carbohydrates += meal.carbohydratesamount;

      return { proteins, vegetables, carbohydrates };
    });

    setTotalProteins(proteins);
    setTotalVegetables(vegetables);
    settotalCarbohydrates(carbohydrates);
  }, [mealsData]);

  useEffect(() => {
    if (vegetablesFilter === '' && proteinsFilter === '' && carbohydratesFilter === '') {
      setIsFiltered(false);
    } else {
      setIsFiltered(true);
    }
  }, [mealFilter, carbohydratesFilter, vegetablesFilter, proteinsFilter]);

  useEffect(() => {
    if (initialDate !== '' && finalDate !== '') {
      setIsDataFiltered(true);
    }
  }, [initialDate, finalDate]);

  function converteData(DataDDMMYY: any) {
    const dataSplit = DataDDMMYY.split('/');
    const novaData = new Date(
      parseInt(dataSplit[2], 10),
      parseInt(dataSplit[1], 10) - 1,
      parseInt(dataSplit[0], 10),
    );
    return novaData;
  }

  const filtered = useMemo(() => mealsData.filter(async (meal: MealProps) => (
    meal.carbohydratefood.toLowerCase().includes(carbohydratesFilter.toLowerCase())
    && meal.proteinfood.toLowerCase().includes(proteinsFilter.toLowerCase())
    && meal.vegetablefood.toLowerCase().includes(vegetablesFilter.toLowerCase())
    && meal.meal.toLowerCase().includes(mealFilter.toLowerCase())
  )), [carbohydratesFilter, proteinsFilter, vegetablesFilter, mealFilter]);

  const filteredPeriod = useMemo(() => mealsData.filter((meal: MealProps) => (
    (converteData(meal.date) >= converteData(initialDate.split('-').reverse().join('/')))
    && (converteData(meal.date) <= converteData(finalDate.split('-').reverse().join('/')))
    && meal.carbohydratefood.toLowerCase().includes(carbohydratesFilter.toLowerCase())
    && meal.proteinfood.toLowerCase().includes(proteinsFilter.toLowerCase())
    && meal.vegetablefood.toLowerCase().includes(vegetablesFilter.toLowerCase())
    && meal.meal.toLowerCase().includes(mealFilter.toLowerCase())
  )), [initialDate, finalDate, proteinsFilter, vegetablesFilter, mealFilter, carbohydratesFilter]);

  return (
    <Container>
      <Base meals createmeal={false}>
        <SectionContent>
          <Header>
            <h1>Todas as Refeições</h1>
            <MacrosContainer>
              <h3>
                Proteínas:
                {' '}
                <span>
                  {totalProteins}
                  g
                </span>
              </h3>
              <h3>
                Vegetais:
                {' '}
                <span>
                  {totalVegetables}
                  g
                </span>
              </h3>
              <h3>
                Carboidratos:
                {' '}
                <span>
                  {totalCarbohydrates}
                  g
                </span>
              </h3>
            </MacrosContainer>
          </Header>
          <Filters>
            <FiltersButtonContainer>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <Select
                        value={mealFilter}
                        onChange={(event) => setMealFilter(event.target.value)}
                      >
                        <option value="">Refeição</option>
                        <option value="café da manha">Café da manhã</option>
                        <option value="almoço">Almoço</option>
                        <option value="almoço">Janta</option>
                      </Select>
                    </td>
                    <td>
                      Data
                    </td>
                    <td>
                      <Select
                        value={proteinsFilter}
                        onChange={(event) => setProteinsFilter(event.target.value)}
                      >
                        <option value="">Proteína</option>
                        <option value="peixe">Peixe</option>
                        <option value="boi">Boi</option>
                        <option value="porco">Porco</option>
                        <option value="frango">Frango</option>
                        <option value="ovo">Ovo</option>
                      </Select>
                    </td>
                    <td>Qntd.</td>
                    <td>
                      <Select
                        value={carbohydratesFilter}
                        onChange={(event) => setCarbohydratesFilter(event.target.value)}
                      >
                        <option value="">Carboidrato</option>
                        <option value="arroz">Arroz</option>
                        <option value="batata">Batata</option>
                        <option value="inhame">Inhame</option>
                        <option value="macarrão">Macarrão</option>
                        <option value="pão">Pão</option>
                      </Select>
                    </td>
                    <td>Qntd.</td>
                    <td>
                      <Select
                        value={vegetablesFilter}
                        onChange={(event) => setVegetablesFilter(event.target.value)}
                      >
                        <option value="">Vegetais</option>
                        <option value="abobrinha">Abobrinha</option>
                        <option value="berinjela">Berinjela</option>
                        <option value="abobora">Abóbora</option>
                        <option value="almeirão">Almeirão</option>
                        <option value="tomate">Tomate</option>
                      </Select>
                    </td>
                    <td>Qntd.</td>
                    <td className="options">
                      {' '}
                      <BsFillGearFill />
                    </td>
                  </tr>
                </tbody>
              </table>
            </FiltersButtonContainer>
          </Filters>
          <MealsContainer>
            {/* <button onClick={() => setIsCreating(true)} type="button">Criar Refeição</button>
            <CreateMealModal id={id} isCreating={isCreating} /> */}
            {
              mealsData.length === 0 && (
              <strong className="no-meal">
                Cadastre uma nova refeição para mostrá-la aqui
                {' '}
                <a href={`${urlConfig.frontendURL}/user/criarrefeicao/${id}`}>
                  <AiOutlinePlus />
                  Criar refeição
                </a>
              </strong>
              )
            }
            {
              filtered.length === 0 && !isFiltered && !isDataFiltered
              && mealsData.map((meal: MealProps) => (
                <MealCard
                  vegetablesamount={meal.vegetablesamount}
                  carbohydratesamount={meal.carbohydratesamount}
                  proteinsamount={meal.proteinsamount}
                  proteinfood={meal.proteinfood}
                  carbohydratefood={meal.carbohydratefood}
                  vegetablefood={meal.vegetablefood}
                  date={meal.date}
                  key={meal.id}
                  id={meal.id}
                  meal={meal.meal}
                  reference={meal.reference}
                />
              ))
            }
            {
              !isDataFiltered
              && filtered.map((meal: MealProps) => (
                <MealCard
                  vegetablesamount={meal.vegetablesamount}
                  carbohydratesamount={meal.carbohydratesamount}
                  proteinsamount={meal.proteinsamount}
                  proteinfood={meal.proteinfood}
                  carbohydratefood={meal.carbohydratefood}
                  vegetablefood={meal.vegetablefood}
                  date={meal.date}
                  key={meal.id}
                  id={meal.id}
                  meal={meal.meal}
                  reference={meal.reference}
                />
              ))
            }
            {
              isFiltered === true && filtered.length === 0
              && (
              <strong>
                Infelizmente não encontramos nada para você...
                {' '}
                <HiOutlineEmojiSad className="icon" />
              </strong>
              )
            }
            {
              filteredPeriod.length === 0 && isDataFiltered
              && (
              <strong>
                Infelizmente não encontramos nada para você...
                {' '}
                <HiOutlineEmojiSad className="icon" />
              </strong>
              )
            }
            {
              isDataFiltered
              && filteredPeriod.map((meal: MealProps) => (
                <MealCard
                  vegetablesamount={meal.vegetablesamount}
                  carbohydratesamount={meal.carbohydratesamount}
                  proteinsamount={meal.proteinsamount}
                  proteinfood={meal.proteinfood}
                  carbohydratefood={meal.carbohydratefood}
                  vegetablefood={meal.vegetablefood}
                  date={meal.date}
                  key={meal.id}
                  id={meal.id}
                  meal={meal.meal}
                  reference={meal.reference}
                />
              ))
            }
          </MealsContainer>
          <DataSearch>
            <h3>
              Período pesquisado:
              {' '}
              <span>{!isDataFiltered ? 'todos' : `${initialDate.split('-').reverse().join('/')} até ${finalDate.split('-').reverse().join('/')} `}</span>
            </h3>
            <Group>
              <InputForm
                type="date"
                value={initialDate}
                onChange={(event) => setInitialDate(event.target.value)}
              />
              <small>até</small>
              <InputForm
                type="date"
                value={finalDate}
                onChange={(event) => setFinalDate(event.target.value)}
              />
            </Group>
          </DataSearch>
        </SectionContent>
      </Base>
    </Container>
  );
}
