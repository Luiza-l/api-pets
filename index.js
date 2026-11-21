
const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();

app.use(express.json());

// GET - Listar todos os pets
app.get('/pets', async (req, res) => {
  try {
    const allPets = await pool.query('SELECT * FROM pets');
    res.json(allPets.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET - Buscar pet pelo ID
app.get('/pets/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const pet = await pool.query(
      'SELECT * FROM pets WHERE id = $1',
      [id]
    );

    if (pet.rows.length === 0) {
      return res.status(404).json({
        error: "Pet not found"
      });
    }

    res.json(pet.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST - Cadastrar um novo pet
app.post('/pets', async (req, res) => {
  try {
    const { nome, tipo, idade } = req.body;

    const newQuery =
      'INSERT INTO pets (nome, tipo, idade) VALUES ($1, $2, $3) RETURNING *';

    const newPet = await pool.query(
      newQuery,
      [nome, tipo, idade]
    );

    res.status(201).json(newPet.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PATCH - Atualizar um pet
app.patch('/pets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, tipo, idade } = req.body;

    const updateQuery =
      'UPDATE pets SET nome = $1, tipo = $2, idade = $3 WHERE id = $4 RETURNING *';

    const updatedPet = await pool.query(
      updateQuery,
      [nome, tipo, idade, id]
    );

    if (updatedPet.rows.length === 0) {
      return res.status(404).json({
        error: "Pet not found"
      });
    }

    res.json(updatedPet.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE - Excluir um pet
app.delete('/pets/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery =
      'DELETE FROM pets WHERE id = $1 RETURNING *';

    const deletedPet = await pool.query(
      deleteQuery,
      [id]
    );

    if (deletedPet.rows.length === 0) {
      return res.status(404).json({
        error: "Pet not found"
      });
    }

    res.json({
      message: "Pet deleted successfully"
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
