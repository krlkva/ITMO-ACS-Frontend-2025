const API_URL = 'http://localhost:3000';

const api = {
  // Объекты
  
  // Получить все объекты
  getProperties: async () => {
    try {
      const response = await fetch(`${API_URL}/properties`);
      if (!response.ok) throw new Error('Ошибка загрузки объектов');
      return await response.json();
    } catch (error) {
      console.error('getProperties error:', error);
      return [];
    }
  },

  // Получить объект по ID
  getProperty: async (id) => {
    try {
      const response = await fetch(`${API_URL}/properties/${id}`);
      if (!response.ok) throw new Error('Объект не найден');
      return await response.json();
    } catch (error) {
      console.error('getProperty error:', error);
      return null;
    }
  },

  // Пользователи
  
  // Проверка пользователя (вход)
  checkUser: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/users?email=${email}&password=${password}`);
      const users = await response.json();
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('checkUser error:', error);
      return null;
    }
  },

  // Регистрация нового пользователя
  registerUser: async (userData) => {
    try {
      // Проверяем, не занят ли email
      const checkResponse = await fetch(`${API_URL}/users?email=${userData.email}`);
      const existingUsers = await checkResponse.json();
      
      if (existingUsers.length > 0) {
        throw new Error('Пользователь с таким email уже существует');
      }
      
      // Создаем нового пользователя
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userData,
          id: Date.now()
        })
      });
      
      if (!response.ok) throw new Error('Ошибка регистрации');
      return await response.json();
    } catch (error) {
      console.error('registerUser error:', error);
      throw error;
    }
  },

  // Бронирования
  
  // Создать новое бронирование
  createBooking: async (bookingData) => {
    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingData,
          id: Date.now(),
          createdAt: new Date().toISOString()
        })
      });
      
      if (!response.ok) throw new Error('Ошибка создания бронирования');
      return await response.json();
    } catch (error) {
      console.error('createBooking error:', error);
      throw error;
    }
  },

  // Получить все бронирования пользователя
  getUserBookings: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/bookings?userId=${userId}`);
      if (!response.ok) throw new Error('Ошибка загрузки бронирований');
      return await response.json();
    } catch (error) {
      console.error('getUserBookings error:', error);
      return [];
    }
  },

  // Отменить бронирование (удалить)
  cancelBooking: async (bookingId) => {
    try {
      const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Ошибка отмены бронирования');
      return true;
    } catch (error) {
      console.error('cancelBooking error:', error);
      throw error;
    }
  }
};