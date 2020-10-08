import math

class operator:
    @staticmethod
    def add(a, b): return a + b
    @staticmethod
    def sub(a, b): return a - b
    @staticmethod
    def mul(a, b): return a * b

class vectorlike:
    def __init__(self, items):
        self._v = tuple(float(i) for i in items)
    def __len__(self):
        return self._v.__len__()
    def __iter__(self):
        return self._v.__iter__()
    def __getitem__(self, key):
        return self._v.__getitem__(key)
    def __add__(self, other):
        if isinstance(other, int) and other == 0:
            return self
        return type(self).add(self, other)
    __radd__ = __add__
    def __sub__(self, other):
        return type(self).sub(self, other)
    def abs2(self):
        return sum(x**2 for x in self)
    def abs(self):
        return math.sqrt(self.abs2())
    @classmethod
    def combine(cls, a, b, fn):
        if not isinstance(a, cls) or not isinstance(b, cls):
            raise TypeError()
        return cls(fn(va, vb) for va, vb in zip(a, b))
    @classmethod
    def scale(cls, v, s):
        return cls(x * s for x in v)
    @classmethod
    def add(cls, a, b):
        return cls.combine(a, b, operator.add)
    @classmethod
    def sub(cls, a, b):
        return cls.combine(a, b, operator.sub)


class vec(vectorlike):
    def __mul__(self, other):
        return type(self).mul(self, other)
    __rmul__ = __mul__
    def __mod__(self, other):
        return type(self).cross(self, other)

    @classmethod
    def xyz(cls, x=0.0, y=0.0, z=0.0):
        return cls((x, y, z))
    def normal(self):
        return self * (1 / self.abs())
    @staticmethod
    def dot(a, b):
        if len(a) != len(b):
            raise TypeError()
        return sum(ax * bx for ax, bx in zip(a, b))
    @classmethod
    def cross(cls, a, b):
        if len(a) != 3 or len(b) != 3:
            raise TypeError()
        return cls((
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0],
        ))
    @classmethod
    def add(cls, a, b):
        return cls.combine(a, b, operator.add)
    @classmethod
    def mul(cls, a, b):
        if isinstance(b, (float, int)):
            return cls.scale(a, b)
        return cls.dot(a, b)
    @classmethod
    def sub(cls, a, b):
        return cls.combine(a, b, operator.sub)

class quat(vectorlike):
    def __init__(self, items=None):
        if items is None:
            items = (1, 0, 0, 0)
        if len(items) != 4:
            raise TypeError()
        super().__init__(items)
    def __mul__(self, other):
        return type(a)._mul_helper(self, other)
    def __rmul__(self, other):
        return type(a)._mul_helper(other, self)
    @classmethod
    def _mul_helper(cls, a, b):
        if isinstance(b, float):
            return cls.scale(a, b)
        if isinstance(b, quat):
            return cls.mul(a, b)
        if isinstance(b, vec):
            return a.transform(b)
        raise TypeError()
    def transform(self, v):
        pass
    @classmethod
    def mul(cls, a, b):
        aw, ax, ay, az = a
        bw, bx, by, bz = b
        return cls((
            aw * bw - ax * bx - ay * by - az * bz,
            aw * bx + ax * bw + ay * bz - az * by,
            aw * by - ax * bz + ay * bw + az * bx,
            aw * bz + ax * by - ay * bx + az * bw,
        ))
    @classmethod
    def from_axis_angle(cls, axis, angle):
        qw = math.cos(angle / 2.0)
        qxyz = vec.scale(axis, math.sin(angle / 2.0))
        return cls((qw, *qxyz))
