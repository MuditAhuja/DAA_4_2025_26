#include <iostream>
using namespace std;

struct Node {
    int data;
    Node* next;
};

Node* front = NULL;
Node* rear = NULL;

void push(int value) {
    Node* newNode = new Node();
    newNode->data = value;
    newNode->next = NULL;

    if (front == NULL) {
        front = rear = newNode;
    } else {
        rear->next = newNode;
        rear = newNode;
    }
}

void pop() {
    if (front == NULL) {
        cout << "Queue is Empty" << endl;
        return;
    }

    Node* temp = front;
    cout << temp->data << endl;
    front = front->next;
    delete temp;

    if (front == NULL) {
        rear = NULL;
    }
}

void peek() {
    if (front == NULL) {
        cout << "Queue is Empty" << endl;
    } else {
        cout << front->data << endl;
    }
}

void display() {
    if (front == NULL) {
        cout << "Queue is Empty" << endl;
        return;
    }

    Node* temp = front;

    while (temp != NULL) {
        cout << temp->data << " ";
        temp = temp->next;
    }

    cout << endl;
}

void isempty() {
    if (front == NULL) {
        cout << "Empty" << endl;
    } else {
        cout << "Not Empty" << endl;
    }
}

void deleteQueue() {
    while (front != NULL) {
        pop();
    }
}

int main() {
    push(10);
    push(20);
    push(30);

    display();
    peek();
    pop();
    display();
    isempty();
    deleteQueue();
    isempty();

    return 0;
}