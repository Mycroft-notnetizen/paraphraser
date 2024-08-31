from sqlalchemy import Column, Integer, String, inspect, create_engine, Table, MetaData ,text
from sqlalchemy.schema import CreateSchema
from sqlalchemy.orm import declarative_base, sessionmaker

# Define the base class
Base = declarative_base()

# Define the UserText table
class UserText(Base):
    __tablename__ = 'user_texts'

    id = Column(Integer, primary_key=True)
    user_id = Column(String)
    text = Column(String)
    response = Column(String)

# Create a class to handle Supabase operations
class SupabaseClient:
    def __init__(self, db_url):
        self.engine = create_engine(db_url)
        self.Session = sessionmaker(bind=self.engine)
        self.metadata = MetaData()
        self.ensure_tables()
    
    def ensure_tables(self):
        # Define the UserText table
        self.UserTextTable = Table(
            UserText.__tablename__, 
            self.metadata,
            Column('id', Integer, primary_key=True),
            Column('user_id', String),
            Column('text', String),
            Column('response', String)
        )

        # Create the table
        self.metadata.create_all(self.engine)

    def save_text(self, user_id, text, response):
        session = self.Session()
        session.execute(
            self.UserTextTable.insert().values(user_id=user_id, text=text, response=response)
        )
        session.commit()
        session.close()

    def save_file(self, user_id, file_path, file_response):
        session = self.Session()
        session.execute(
            self.UserTextTable.insert().values(user_id=user_id, text=file_path, response=file_response)
        )
        session.commit()
        session.close()

    def get_texts_by_user(self, user_id):
        session = self.Session()
        query = self.UserTextTable.select().where(self.UserTextTable.c.user_id == user_id)
        texts = session.execute(query).fetchall()
        session.close()
        return texts

# Example usage:
# db_url = 'postgresql://user:password@localhost/mydatabase'
# supabase_client = SupabaseClient(db_url, 'my_custom_schema')
# supabase_client.save_text('user123', 'Hello, world!', 'Hola, mundo!')
# texts = supabase_client.get_texts_by_user('user123')
# print([text.text for text in texts])
