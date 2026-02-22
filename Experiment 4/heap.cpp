#include<iostream>
using namespace std;

#define MAX 100

int heap[MAX];
int heapSize=0;

void heapifyUp(int i){
    while(i>0 && heap[(i-1)/2]>heap[i]){
        swap(heap[(i-1)/2], heap[i]);
        i=(i-1)/2;
    }
}

void heapifyDown(int i ){
  int smallest= i;
  int left= 2*i+1;
  int right = 2*i+2;
  
  if(left<heapSize && heap[smallest]>heap[left]) smallest = left;
  if(right<heapSize && heap[smallest]>heap[right]) smallest = right;
  
  if(smallest != i){
    swap(heap[smallest], heap[i]);
    heapifyDown(smallest);
  } 
}

int search(int val){
    for (int i=0; i<heapSize; i++){
      if (heap[i]==val) return i;
    }
    return -1;
}

void deleteByIndex(int index){
    if (index<0 || index >= heapSize){
        cout<<"Invalid index"<<endl;
        return;
    }

    heap[index]=heap[heapSize-1];
    heapSize--;

    if (index>0 && heap[index]<heap[(index-1)/2]){
        heapifyUp(index);
    } else {
      heapifyDown(index);
    }
}

void insert(int val){
  if(heapSize==MAX){
    cout<<"overflow"<<endl;
    return ;
  }
  
  heap[heapSize]=val;
  heapSize++;
  heapifyUp(heapSize-1);
}

void deleteRoot(){
    if(heapSize==0){
      cout<<"Underflow"; return;
    }

    heap[0]=heap[heapSize-1];
    heapSize--;
    heapifyDown(0);
}

void printHeap(){
    for (int i = 0; i < heapSize; i++) cout<<heap[i]<<" ";
    cout << endl;
}

int main(){
  insert(10);
  insert(30);
  insert(1);
  
  printHeap();

  return 0;
}