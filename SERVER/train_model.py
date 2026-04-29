import os
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Input, Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping

# 1. Paths and Parameters
train_dir = 'dataset/train'
test_dir = 'dataset/test'
img_size = 48
batch_size = 64

# 2. Data Loading & Augmentation
train_datagen = ImageDataGenerator(rescale=1./255, rotation_range=10, zoom_range=0.1, horizontal_flip=True)
test_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_directory(
    train_dir, target_size=(img_size, img_size), color_mode="grayscale", 
    batch_size=batch_size, class_mode='categorical', shuffle=True
)

test_generator = test_datagen.flow_from_directory(
    test_dir, target_size=(img_size, img_size), color_mode="grayscale", 
    batch_size=batch_size, class_mode='categorical', shuffle=False
)

# 3. Build the "Lite" CNN for faster CPU training
def build_lite_model():
    model = Sequential([
        # Use Input layer to fix the Keras warning
        Input(shape=(img_size, img_size, 1)),
        
        # Block 1 (Reduced from 32 to 16 filters)
        Conv2D(16, (3, 3), padding='same', activation='relu'),
        MaxPooling2D(pool_size=(2, 2)),

        # Block 2 (Reduced from 64 to 32 filters)
        Conv2D(32, (3, 3), padding='same', activation='relu'),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.2), # Lighter dropout

        # Block 3 removed entirely for speed!

        # Classification (Reduced Dense layer from 128 to 64)
        Flatten(),
        Dense(64, activation='relu'),
        Dropout(0.3),
        Dense(7, activation='softmax')
    ])
    return model

model = build_lite_model()
model.compile(optimizer=Adam(learning_rate=0.001), loss='categorical_crossentropy', metrics=['accuracy'])

# 4. Train and Save
checkpoint = ModelCheckpoint("mood_model.h5", monitor='val_accuracy', save_best_only=True, mode='max')
early_stopping = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)

print("Starting lightweight training...")

# 5. Artificially shorten the epochs for faster feedback
# Instead of 449 steps, we will only do 100 steps per epoch
steps_per_epoch = 100 
validation_steps = 20

model.fit(
    train_generator,
    steps_per_epoch=steps_per_epoch,
    epochs=15, # Dropped from 25 to 15
    validation_data=test_generator,
    validation_steps=validation_steps,
    callbacks=[checkpoint, early_stopping]
)
print("Training complete! Brain saved as mood_model.h5")