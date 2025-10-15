// Автоматическое определение базового URL для API
const getApiBaseUrl = () => {
    // Если мы на том же домене, используем относительный путь /api
    return '/api';
};

const API_BASE_URL = getApiBaseUrl();

class FamilyTreeApp {
    constructor() {
        this.persons = [];
        this.init();
    }

    async apiCall(endpoint, options = {}) {
        try {
            const url = `${API_BASE_URL}${endpoint}`;
            console.log('Making API call to:', url);

            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            this.showError(`Ошибка соединения с сервером: ${error.message}`);
            throw error;
        }
    }

    // Остальные методы остаются без изменений...
    async loadPersons() {
        try {
            this.persons = await this.apiCall('/persons/');
            this.updateParentSelect();
        } catch (error) {
            console.error('Failed to load persons:', error);
        }
    }

    async loadTree() {
        try {
            const treeData = await this.apiCall('/tree/');
            this.renderTree(treeData);
        } catch (error) {
            console.error('Failed to load tree:', error);
            this.showTreeError();
        }
    }

    updateParentSelect() {
        const select = document.getElementById('parentId');
        select.innerHTML = '<option value="">-- Выберите родителя --</option>';

        this.persons.forEach(person => {
            const option = document.createElement('option');
            option.value = person.id;
            option.textContent = `${person.first_name} ${person.last_name} (ID: ${person.id})`;
            select.appendChild(option);
        });
    }

    renderTree(treeData) {
        const container = document.getElementById('treeContainer');

        if (!treeData || treeData.length === 0) {
            container.innerHTML = `
                <div class="empty-tree">
                    <h3>Дерево пока пустое 🌱</h3>
                    <p>Добавьте первого родственника чтобы начать строить дерево!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = treeData.map(person => this.renderTreeNode(person, 0)).join('');
    }

    renderTreeNode(person, level = 0) {
        const childrenHTML = person.children && person.children.length > 0
            ? `<div class="children-container">${person.children.map(child => this.renderTreeNode(child, level + 1)).join('')}</div>`
            : '';

        return `
            <div class="tree-node level-${level}">
                <div class="person-card">
                    <div class="person-name">${person.first_name} ${person.last_name}</div>
                    ${person.birth_date ? `<div class="person-birth">🎂 ${new Date(person.birth_date).toLocaleDateString('ru-RU')}</div>` : ''}
                    <div class="person-id">ID: ${person.id}</div>
                </div>
                ${childrenHTML}
            </div>
        `;
    }

    setupEventListeners() {
        const form = document.getElementById('personForm');
        form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(event) {
        event.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.textContent;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Добавление...';

            const formData = new FormData(event.target);
            const personData = {
                first_name: formData.get('first_name'),
                last_name: formData.get('last_name'),
                birth_date: formData.get('birth_date'),
                parent_id: formData.get('parent_id') || null
            };

            await this.apiCall('/persons/', {
                method: 'POST',
                body: JSON.stringify(personData)
            });

            this.showSuccess('Родственник успешно добавлен!');
            event.target.reset();

            await this.loadPersons();
            await this.loadTree();

        } catch (error) {
            console.error('Failed to create person:', error);
            this.showError('Ошибка при добавлении родственника');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showMessage(message, type) {
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;

        const form = document.getElementById('personForm');
        form.parentNode.insertBefore(messageDiv, form);

        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    showTreeError() {
        const container = document.getElementById('treeContainer');
        container.innerHTML = `
            <div class="error">
                Не удалось загрузить дерево. Проверьте, запущен ли бэкенд.
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FamilyTreeApp();
});