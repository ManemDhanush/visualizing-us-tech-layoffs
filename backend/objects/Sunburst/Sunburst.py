class location_freq:
    def __init__(self, name, size):
        self.name = name
        self.size = size

    def __repr__(self):
        return f'location_freq(name={self.name}, value={self.size})'

class sunburst:
    def __init__(self, name, children=None):
        self.name = name
        self.children = children or []

    def to_dict(self):
        return {
            'name': self.name,
            'children': [child.__dict__ for child in self.children],
        }

    @classmethod
    def from_dict(cls, d):
        children = [location_freq(**child_dict) for child_dict in d['children']]
        return cls(d['name'], children)